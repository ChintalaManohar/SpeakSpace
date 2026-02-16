const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Successfully connected to server with ID:", socket.id);

    // Test join-room
    const sessionId = "test-session-123";
    const userId = "test-user-456";

    console.log(`Joining room ${sessionId}...`);
    socket.emit("join-room", { sessionId, userId });
});

socket.on("joined-room", (data) => {
    console.log("Joined room event received:", data);
    process.exit(0);
});

socket.on("error", (err) => {
    console.error("Socket error:", err);
    process.exit(1);
});

// Timeout after 5 seconds
setTimeout(() => {
    console.error("Timeout: Could not connect or join room");
    process.exit(1);
}, 5000);
