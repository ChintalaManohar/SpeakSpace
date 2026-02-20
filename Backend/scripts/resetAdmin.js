require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const user = await User.findOne({ email: 'admin@speakspace.com' });
        if (user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash('admin123', salt);
            await user.save();
            console.log('Admin password forcefully reset to admin123!');
        } else {
            console.log('admin@speakspace.com user not found in the DB.');
        }
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
