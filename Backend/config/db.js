const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error("Continuing server startup without DB connection (MVP Mode)");
        // process.exit(1); // Don't crash for MVP testing if DB fails
    }
};

module.exports = connectDB;
