const Feedback = require('../models/Feedback');
const Session = require('../models/Session');

// @desc    Submit feedback for a session
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { feedbackArray } = req.body; // Expecting an array of feedback objects

        if (!feedbackArray || !Array.isArray(feedbackArray) || feedbackArray.length === 0) {
            return res.status(400).json({ message: 'No feedback data provided' });
        }

        const savedFeedback = [];
        const errors = [];

        for (const item of feedbackArray) {
            const { sessionId, toUser, confidence, clarity, listening, comment } = item;

            // Basic Validation
            if (!sessionId || !toUser || !confidence || !clarity || !listening) {
                errors.push({ item, message: 'Missing required fields' });
                continue;
            }

            // Prevent self-feedback
            if (toUser === req.user._id.toString()) {
                errors.push({ item, message: 'Cannot give feedback to yourself' });
                continue;
            }

            // Check if session exists (Optional optimization: cache or query once)
            // For now, simple check per item or rely on DB constraints. 
            // Let's trust the frontend sent a valid sessionId for the MVP, 
            // or we could validate session participation if needed.

            try {
                const feedback = await Feedback.create({
                    sessionId,
                    fromUser: req.user._id,
                    toUser,
                    confidence,
                    clarity,
                    listening,
                    comment
                });
                savedFeedback.push(feedback);
            } catch (err) {
                // Handle duplicate key error (already submitted)
                if (err.code === 11000) {
                    errors.push({ item, message: 'Feedback already submitted for this user' });
                } else {
                    errors.push({ item, message: err.message });
                }
            }
        }

        if (savedFeedback.length === 0 && errors.length > 0) {
            return res.status(400).json({ message: 'Failed to submit feedback', errors });
        }

        // If at least one feedback was submitted successfully, mark the user as attended
        // We assume all feedback items belong to the same session for this batch, or we loop through unique sessionIds
        if (savedFeedback.length > 0) {
            const uniqueSessionIds = [...new Set(savedFeedback.map(f => f.sessionId))];
            for (const sId of uniqueSessionIds) {
                await Session.findByIdAndUpdate(sId, {
                    $addToSet: { attendedParticipants: req.user._id }
                });
            }
        }

        res.status(201).json({
            message: `Successfully submitted ${savedFeedback.length} feedback entries`,
            savedFeedback,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (err) {
        console.error("Feedback Submission Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get feedback statistics for the logged-in user
// @route   GET /api/feedback/stats
// @access  Private
exports.getFeedbackStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get total sessions attended and details
        const attendedSessionsDocs = await Session.find({ attendedParticipants: userId })
            .select('topic startTime duration')
            .sort({ startTime: -1 });

        const sessionsAttendedCount = attendedSessionsDocs.length;

        // 2. Get all feedback received by user
        const feedbacks = await Feedback.find({ toUser: userId }).populate('sessionId', 'topic startTime');

        if (feedbacks.length === 0) {
            return res.json({
                sessionsAttended: sessionsAttendedCount,
                attendedSessionsList: attendedSessionsDocs,
                averageScores: { confidence: 0, clarity: 0, listening: 0, overall: 0 },
                totalFeedbackReceived: 0,
                recentFeedback: []
            });
        }

        // 3. Calculate Averages
        let totalConfidence = 0;
        let totalClarity = 0;
        let totalListening = 0;

        feedbacks.forEach(f => {
            totalConfidence += f.confidence;
            totalClarity += f.clarity;
            totalListening += f.listening;
        });

        const count = feedbacks.length;
        const avgConfidence = (totalConfidence / count).toFixed(1);
        const avgClarity = (totalClarity / count).toFixed(1);
        const avgListening = (totalListening / count).toFixed(1);
        const overall = ((Number(avgConfidence) + Number(avgClarity) + Number(avgListening)) / 3).toFixed(1);

        // 4. Get recent comments/feedback
        const recentFeedback = feedbacks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5) // Last 5
            .map(f => ({
                id: f._id,
                sessionTopic: f.sessionId ? f.sessionId.topic : 'Unknown Session',
                sessionDate: f.sessionId ? f.sessionId.startTime : f.createdAt,
                confidence: f.confidence,
                clarity: f.clarity,
                listening: f.listening,
                comment: f.comment,
                date: f.createdAt
            }));

        res.json({
            sessionsAttended: sessionsAttendedCount,
            attendedSessionsList: attendedSessionsDocs,
            averageScores: {
                confidence: avgConfidence,
                clarity: avgClarity,
                listening: avgListening,
                overall
            },
            totalFeedbackReceived: count,
            recentFeedback
        });

    } catch (err) {
        console.error('Error fetching feedback stats:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
