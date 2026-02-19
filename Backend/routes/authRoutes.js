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
    updateSettings
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const log = require('../utils/fileLogger');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/');
        log(`Multer destination: ${uploadPath}`);
        console.log('Multer destination:', uploadPath);
        cb(null, uploadPath); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        log(`Multer filename: ${filename}`);
        console.log('Multer filename:', filename);
        cb(null, filename);
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
router.put('/profile', (req, res, next) => {
    log('Profile update request received');
    next();
}, protect, upload.single('avatar'), updateUserProfile);

module.exports = router;
