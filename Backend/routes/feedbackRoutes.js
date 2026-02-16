const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitFeedback, getFeedbackStats } = require('../controllers/feedbackController');

router.post('/', protect, submitFeedback);
router.get('/stats', protect, getFeedbackStats);

module.exports = router;
