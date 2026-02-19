const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Session = require("./models/Session");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const run = async () => {
    try {
        const session = await Session.findOne({ topic: { $regex: 'ethics', $options: 'i' } });

        if (session) {
            const now = new Date();
            const start = new Date(session.startTime);
            const end = new Date(start.getTime() + session.duration * 60000);

            console.log("--- SESSION DETAILS ---");
            console.log(`Topic: ${session.topic}`);
            console.log(`Stored StartTime: ${session.startTime.toISOString()}`); // ISO string usually is UTC
            console.log(`Local String: ${start.toLocaleString()}`);
            console.log(`Duration: ${session.duration} mins`);
            console.log(`Computed EndTime: ${end.toLocaleString()}`);

            console.log("--- TIME CHECK ---");
            console.log(`Server Now: ${now.toLocaleString()}`);
            console.log(`Is Past (Start < Now)? ${start < now}`);
            console.log(`Is Completed (End < Now)? ${end < now}`);
        } else {
            console.log("Session not found with topic 'ethics'");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
