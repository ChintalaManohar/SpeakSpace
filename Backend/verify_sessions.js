const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Session = require("./models/Session");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const verifySessions = async () => {
    try {
        const count = await Session.countDocuments();
        console.log(`Total Sessions in DB: ${count}`);

        if (count > 0) {
            const sessions = await Session.find({});
            console.log("Sessions found:");
            sessions.forEach(s => {
                console.log(`- ID: ${s._id}, Topic: ${s.topic}, Type: ${s.type}, Status: ${s.status}, Start: ${s.startTime}`);
            });
        } else {
            console.log("No sessions found in database.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifySessions();
