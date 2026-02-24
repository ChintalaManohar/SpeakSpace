const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    googleLogin,
    getMe,
    verifyEmail,
    updateUserProfile,
    changePassword,
    resendVerification,
    updateSettings,
    getUserActivity
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const log = require('../utils/fileLogger');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for file uploads
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'speakspace_avatars',
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif']
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        log(`File filter checking: ${file.originalname}, mimetype: ${file.mimetype}`);
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            log('File filter passed');
            return cb(null, true);
        } else {
            log('File filter failed');
            cb('Error: Images Only!');
        }
    }
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);
router.put('/change-password', protect, changePassword);
router.post('/resend-verification', protect, resendVerification);
router.put('/settings', protect, updateSettings);
router.get('/activity', protect, getUserActivity);
router.put('/profile', (req, res, next) => {
    log('Profile update request received');
    next();
}, protect, upload.single('avatar'), updateUserProfile);

module.exports = router;
