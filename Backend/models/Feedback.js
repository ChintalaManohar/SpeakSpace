const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    confidence: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    clarity: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    listening: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate feedback from same user to same user in same session
feedbackSchema.index({ sessionId: 1, fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
