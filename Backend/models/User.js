const mongoose = require('mongoose');

console.log('User Model Schema Loaded');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String
    },
    avatar: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    settings: {
        notifications: {
            sessionReminders: { type: Boolean, default: true },
            feedback: { type: Boolean, default: true }
        },
        media: {
            defaultMic: { type: Boolean, default: true },
            defaultCamera: { type: Boolean, default: true }
        },
        privacy: {
            profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' }
        },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

module.exports = mongoose.model('User', userSchema);
