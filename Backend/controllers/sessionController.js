const Session = require('../models/Session');

// Helper to determine status based on time
const getSessionStatus = (session) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(start.getTime() + session.duration * 60000);

    if (now < start) {
        return 'Upcoming';
    } else if (now >= start && now <= end) {
        return 'Live';
    } else {
        return 'Completed';
    }
};

exports.getSessions = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        if (type) {
            query.type = type;
        }

        // Fetch all sessions (we filter completed later to handle dynamic time)
        // Optimization: We could filter by startTime in DB query for strictly future sessions,
        // but to handle "Live" correctly we need to check end time which depends on duration.
        // For v1 with reasonable session count, JS filtering is fine.
        const sessions = await Session.find(query).sort({ startTime: 1 });

        // const now = new Date(); // Unused

        const processedSessions = sessions.filter(session => {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            return new Date(session.startTime) >= startOfToday;
        }).map(session => {
            const status = getSessionStatus(session);
            return {
                ...session.toObject(),
                status
            };
        });

        res.json(processedSessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Book a session
// @route   POST /api/sessions/:id/book
// @access  Private
exports.bookSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Check if already booked
        if (session.participants && session.participants.some(participantId => participantId.toString() === req.user._id.toString())) {
            return res.status(400).json({ message: 'You have already booked this session' });
        }

        // Check availability
        if (session.bookedSlots >= session.maxSlots) {
            return res.status(400).json({ message: 'Session is full' });
        }

        // Add user to participants
        session.participants.push(req.user._id);
        session.bookedSlots += 1;

        await session.save();

        res.json({ message: 'Session booked successfully', session });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my booked sessions
// @route   GET /api/sessions/my-sessions
// @access  Private
exports.getMySessions = async (req, res) => {
    try {
        // Find sessions where participants array contains user ID
        const sessions = await Session.find({ participants: req.user._id }).sort({ startTime: 1 });

        const processedSessions = sessions.map(session => {
            const status = getSessionStatus(session);
            return {
                ...session.toObject(),
                status
            };
        });

        res.json(processedSessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('participants', 'name email') // Populate booked participants (optional, useful for debugging)
            .populate('attendedParticipants', 'name email'); // Populate actual attendees

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
