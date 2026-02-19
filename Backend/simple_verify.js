const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Session = require("./models/Session");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const run = async () => {
    try {
        const sessions = await Session.find({});
        console.log(`TOTAL_SESSIONS: ${sessions.length}`);
        if (sessions.length > 0) {
            const s = sessions[0];
            const startTime = new Date(s.startTime);
            const now = new Date();
            const status = s.status; // 'scheduled' from DB

            // Calculate computed status like backend does
            const end = new Date(startTime.getTime() + s.duration * 60000);
            let computedStatus = 'Completed';
            if (now < startTime) computedStatus = 'Upcoming';
            else if (now >= startTime && now <= end) computedStatus = 'Live';

            console.log(`FIRST_SESSION_ID: ${s._id}`);
            console.log(`SESSION_DATE: ${startTime.toISOString()}`);
            console.log(`CURRENT_TIME: ${now.toISOString()}`);
            console.log(`DB_STATUS: ${status}`);
            console.log(`COMPUTED_STATUS: ${computedStatus}`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
