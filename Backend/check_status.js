const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Session = require("./models/Session");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const run = async () => {
    try {
        const now = new Date();
        const past = await Session.countDocuments({ startTime: { $lt: now } });
        const future = await Session.countDocuments({ startTime: { $gte: now } });

        console.log(`PAST_CLOUDS: ${past}`);
        console.log(`FUTURE_CLOUDS: ${future}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
