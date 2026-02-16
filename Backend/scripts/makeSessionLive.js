const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Session = require('../models/Session');

const path = require('path');

// Load env vars from Backend/.env (robust path)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const makeSessionLive = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the first session
        const session = await Session.findOne();

        if (!session) {
            console.log('No sessions found!');
            process.exit(1);
        }

        console.log(`Found session: ${session.topic} (ID: ${session._id})`);
        console.log(`Old Start Time: ${session.startTime}`);

        // Set start time to 5 minutes ago to ensure it's definitely "Live" right now
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

        session.startTime = fiveMinutesAgo;
        session.duration = 60; // Ensure it lasts for an hour

        await session.save();

        console.log(`New Start Time: ${session.startTime}`);
        console.log('Session is now LIVE!');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

makeSessionLive();
