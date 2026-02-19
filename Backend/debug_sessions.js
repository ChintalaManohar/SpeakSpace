const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Session = require("./models/Session");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const run = async () => {
    try {
        const sessions = await Session.find({});
        console.log(`TOTAL: ${sessions.length}`);

        const now = new Date();
        console.log(`NOW: ${now.toISOString()}`);

        if (sessions.length > 0) {
            const s = sessions[0];
            const start = new Date(s.startTime);
            console.log(`SESSION 0 START: ${start.toISOString()}`);
            console.log(`IS PAST: ${start < now}`);
        } else {
            console.log("NO SESSIONS FOUND");
        }

        // Create a future session
        console.log("CREATING FUTURE SESSION...");
        const futureTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
        const newSession = await Session.create({
            type: 'group_discussion',
            topic: 'Test Future Session',
            startTime: futureTime,
            duration: 60,
            level: 'Beginner',
            maxSlots: 5,
            meetLink: 'http://test.com',
            status: 'scheduled'
        });
        console.log(`CREATED SESSION: ${newSession._id} AT ${newSession.startTime}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
