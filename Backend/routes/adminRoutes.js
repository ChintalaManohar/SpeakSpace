const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getDashboardStats,
    getAllUsers,
    createSession,
    getAllSessions,
    updateSession,
    deleteSession
} = require('../controllers/adminController');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.route('/sessions')
    .post(protect, admin, createSession)
    .get(protect, admin, getAllSessions);
router.route('/sessions/:id')
    .put(protect, admin, updateSession)
    .delete(protect, admin, deleteSession);

module.exports = router;
