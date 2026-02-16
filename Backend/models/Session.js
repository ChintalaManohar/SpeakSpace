const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["group_discussion", "debate"],
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: { // in minutes
        type: Number,
        required: true
    },
    level: {
        type: String, // e.g., 'Beginner', 'Intermediate'
        required: false
    },
    maxSlots: {
        type: Number,
        required: true
    },
    bookedSlots: {
        type: Number,
        default: 0
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    meetLink: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    attendedParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { collection: 'session' });

module.exports = mongoose.model('Session', sessionSchema);
