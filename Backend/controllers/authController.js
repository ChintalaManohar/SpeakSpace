const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const sendEmail = require('../utils/emailService');
const log = require('../utils/fileLogger');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Create user instance
    const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        isVerified: false
    });

    await user.save();

    if (user) {
        // Send verification email
        const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

        const message = `
            <h1>Verify Your Email</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
            <p>This link expires in 15 minutes.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'SpeakSpace Account Verification',
                message
            });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                message: 'Registration successful! Please check your email to verify your account.'
            });
        } catch (error) {
            console.error('Email send failed:', error);
            // Delete user if email fails (optional, but good practice to avoid zombie accounts)
            await User.findByIdAndDelete(user._id);
            res.status(500);
            throw new Error('Email could not be sent. Please check server logs.');
        }

    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, isAdmin } = req.body;

    // Admin Login Logic
    if (isAdmin) {
        // Debugging: Log if admin env vars are missing (Be careful not to log the actual password in production if possible, or just log existence)
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.error('CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD environment variables are NOT set.');
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            console.log('Admin login successful for:', email);
            res.json({
                name: 'Admin',
                email: email,
                role: 'admin',
                token: generateToken(null, 'admin')
            });
            return;
        } else {
            console.warn('Admin login failed. Invalid credentials for:', email);
            // Optional: Log what was expected vs received for debugging (DO NOT DO THIS IN PROD LOGS USUALLY, but for now might be helpful if user is stuck)
            // console.log(`Expected: ${process.env.ADMIN_EMAIL}, Received: ${email}`);
            res.status(401);
            throw new Error('Invalid Admin Credentials');
        }
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        if (!user.isVerified) {
            res.status(403);
            throw new Error('Please verify your email address before logging in.');
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const verificationToken = req.params.token;

    const user = await User.findOne({
        verificationToken,
        verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
});

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        res.status(400);
        throw new Error('Google token is required');
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, sub: googleId, picture } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                if (user.authProvider === 'local') {
                    // user.authProvider = 'google'; 
                }
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                isVerified: true,
                avatar: picture
            });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401);
        throw new Error('Invalid Google Token');
    }
});

// @desc    Get user data
// @route   GET /api/user/profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.about) user.about = req.body.about;

        if (req.file) {
            log(`File received in controller: ${JSON.stringify(req.file)}`);
            console.log('File received in controller:', req.file);

            // Delete old avatar if it exists
            if (user.avatar) {
                const oldAvatarPath = path.join(__dirname, '..', user.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlink(oldAvatarPath, (err) => {
                        if (err) {
                            console.error('Failed to delete old avatar:', err);
                            log(`Failed to delete old avatar: ${err}`);
                        } else {
                            console.log('Old avatar deleted successfully');
                            log('Old avatar deleted successfully');
                        }
                    });
                }
            }

            user.avatar = `/uploads/${req.file.filename}`;
        } else {
            log('No file received in controller');
            console.log('No file received in controller');
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            about: updatedUser.about,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Generate JWT
const generateToken = (id, role = 'user') => {
    const payload = { role };
    if (id) payload.id = id;

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid current password');
    }
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user.isVerified) {
        res.status(400);
        throw new Error('User is already verified');
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

    const message = `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
        <p>This link expires in 15 minutes.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'SpeakSpace Account Verification',
            message
        });
        res.json({ message: 'Verification email sent' });
    } catch (error) {
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Update user settings
// @route   PUT /api/user/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.settings = req.body.settings || user.settings;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            settings: updatedUser.settings,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user activity stats
// @route   GET /api/auth/activity
// @access  Private
const getUserActivity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const Session = require('../models/Session');

    // Helper to get start date
    const getStartDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    };

    const getStats = async (days) => {
        const startDate = getStartDate(days);
        const stats = await Session.aggregate([
            {
                $match: {
                    attendedParticipants: userId,
                    startTime: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = { group_discussion: 0, debate: 0 };
        stats.forEach(s => {
            if (result[s._id] !== undefined) {
                result[s._id] = s.count;
            }
        });
        return result;
    };

    const weekStats = await getStats(7);
    const monthStats = await getStats(30);
    const yearStats = await getStats(365);

    res.json({
        week: weekStats,
        month: monthStats,
        year: yearStats
    });
});

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    verifyEmail,
    getMe,
    updateUserProfile,
    changePassword,
    resendVerification,
    updateSettings,
    getUserActivity
};
