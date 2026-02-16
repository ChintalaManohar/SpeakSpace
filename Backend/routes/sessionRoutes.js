const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

const { protect } = require('../middleware/authMiddleware');

router.get('/', sessionController.getSessions);
router.get('/my-sessions', protect, sessionController.getMySessions);
router.post('/:id/book', protect, sessionController.bookSession);

module.exports = router;
