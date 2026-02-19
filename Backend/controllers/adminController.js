const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Session = require('../models/Session');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();

    const now = new Date();
    const activeSessions = await Session.countDocuments({
        startTime: { $gte: now },
        status: { $ne: 'cancelled' } // Assuming 'status' field will be added
    });

    res.status(200).json({
        totalUsers,
        totalSessions,
        activeSessions
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, '-password'); // Exclude password

    // We need to aggregate session attendance for each user
    // This could be expensive. For now, let's just return basic info
    // Or we can do a lookup if sessions store participants.

    // Simplest approach: Return users, frontend can display basic info.
    // If we need sessions attended count, we might need to aggregate.

    const usersWithStats = await Promise.all(users.map(async (user) => {
        const sessionsAttended = await Session.countDocuments({
            attendedParticipants: user._id
        });

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            sessionsAttended
        };
    }));

    res.status(200).json(usersWithStats);
});

// @desc    Create a new session (Admin)
// @route   POST /api/admin/sessions
// @access  Private/Admin
const createSession = asyncHandler(async (req, res) => {
    const { type, topic, startTime, duration, level, maxSlots, meetLink } = req.body;

    if (!type || !topic || !startTime || !duration || !maxSlots || !meetLink) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const session = await Session.create({
        type,
        topic,
        startTime,
        duration,
        level,
        maxSlots,
        meetLink,
        status: 'scheduled'
    });

    res.status(201).json(session);
});

// @desc    Get all sessions (Admin)
// @route   GET /api/admin/sessions
// @access  Private/Admin
const getAllSessions = asyncHandler(async (req, res) => {
    const sessions = await Session.find({}).sort({ startTime: -1 });
    res.status(200).json(sessions);
});

// @desc    Update session
// @route   PUT /api/admin/sessions/:id
// @access  Private/Admin
const updateSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedSession);
});

// @desc    Delete session
// @route   DELETE /api/admin/sessions/:id
// @access  Private/Admin
const deleteSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    await session.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getDashboardStats,
    getAllUsers,
    createSession,
    getAllSessions,
    updateSession,
    deleteSession
};
