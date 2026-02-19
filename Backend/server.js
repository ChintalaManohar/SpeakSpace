const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
const log = require('./utils/fileLogger');
app.use((req, res, next) => {
    log(`${req.method} ${req.originalUrl}`);
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(errorHandler);

const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socket/socket');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for development, secure this in production
        methods: ["GET", "POST"]
    }
});

// Initialize socket handler
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    log(`Server started on port ${PORT}`);
});
