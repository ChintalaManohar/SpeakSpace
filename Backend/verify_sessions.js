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
            console.log("First 3 sessions:");
            console.log(JSON.stringify(sessions.slice(0, 3), null, 2));
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
