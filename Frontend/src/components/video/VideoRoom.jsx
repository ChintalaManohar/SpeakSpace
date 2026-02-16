import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import FeedbackModal from '../feedback/FeedbackModal';
import './VideoRoom.css';

const VideoRoom = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Connecting...');
    const [logs, setLogs] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Refs
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef({}); // { socketId: { peerConnection } }
    const iceCandidatesQueue = useRef({}); // { socketId: [candidates] }
    const allParticipants = useRef(new Map()); // Map<userId, { id: userId, name: name }>

    // State for UI rendering
    const [remoteStreams, setRemoteStreams] = useState([]); // Array of { id: socketId, stream: MediaStream }
    const [stream, setStream] = useState(null);
    const streamRef = useRef(null); // Ref to hold stream for cleanup

    // Display Name
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
    const displayUserId = user.name || 'User';

    useEffect(() => {
        let mounted = true;
        let currentSocket = null;
        const token = localStorage.getItem('token');

        if (!token) {
            setStatus('Authentication Required');
            return;
        }

        // 1. Get User Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                if (!mounted) {
                    currentStream.getTracks().forEach(track => track.stop());
                    return;
                }

                setStream(currentStream);
                streamRef.current = currentStream; // Update ref

                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }

                // 2. Connect Socket
                currentSocket = connectSocket(currentStream, token);
            })
            .catch((err) => {
                addLog(`Media Error: ${err}`);
                console.error("Error accessing media devices:", err);
                setStatus('Media Error');
            });

        return () => {
            mounted = false;

            // Cleanup Socket
            if (currentSocket) currentSocket.disconnect();
            if (socketRef.current) socketRef.current.disconnect();

            // Cleanup Peer Connections
            Object.values(peersRef.current).forEach(({ peerConnection }) => {
                if (peerConnection) peerConnection.close();
            });
            peersRef.current = {};

            // Cleanup Local Stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [sessionId]);

    const connectSocket = (currentStream, token) => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const socket = io('http://localhost:5000');
        socketRef.current = socket;

        socket.on('connect', () => {
            addLog('Connected to socket server');
            setStatus('Connected');
            addLog(`Joining room: ${sessionId}`);
            socket.emit('join-room', { sessionId, token });
        });

        // Handle existing users (sent upon joining)
        socket.on('existing-users', (users) => {
            addLog(`Found ${users.length} existing users`);
            users.forEach((user) => {
                // Track for feedback
                if (user.userId) {
                    allParticipants.current.set(user.userId, { id: user.userId, name: user.name });
                }

                addLog(`Initiating connection to existing user: ${user.name} (${user.id})`);
                createPeerConnection(user.id, user.name, currentStream, true); // true = initiator
            });
        });

        // Handle new user joining (incoming connection)
        socket.on('user-joined', (user) => {
            const remoteSocketId = user.id || user;
            const remoteName = user.name || 'User';
            const remoteUserId = user.userId;

            // Track for feedback
            if (remoteUserId) {
                allParticipants.current.set(remoteUserId, { id: remoteUserId, name: remoteName });
            }

            if (peersRef.current[remoteSocketId]) return; // Already connected
            addLog(`New user joined: ${remoteName} (${remoteSocketId}). Waiting for their offer...`);
            createPeerConnection(remoteSocketId, remoteName, currentStream, false); // false = not initiator
        });

        // ... (rest of listeners)

        // Handle WebRTC Signals
        socket.on('signal', async ({ from, data }) => {
            handleSignal(from, data, currentStream);
        });

        // Handle User Left
        socket.on('user-left', (leftSocketId) => {
            addLog(`User left: ${leftSocketId}`);
            cleanupPeer(leftSocketId);
        });

        return socket;
    };

    const cleanupPeer = (socketId) => {
        // Close PC
        if (peersRef.current[socketId]) {
            peersRef.current[socketId].peerConnection.close();
            delete peersRef.current[socketId];
        }
        // Remove Stream
        setRemoteStreams(prev => prev.filter(p => p.id !== socketId));
        // Clear ICE Queue
        if (iceCandidatesQueue.current[socketId]) {
            delete iceCandidatesQueue.current[socketId];
        }
    };

    const handleSignal = async (from, data, currentStream) => {
        let peerObj = peersRef.current[from];

        if (!peerObj) {
            addLog(`Received signal from unknown peer ${from}, creating connection...`);
            peerObj = createPeerConnection(from, 'User', currentStream, false);
        }

        const pc = peerObj.peerConnection;

        try {
            if (data.type === 'offer') {
                addLog(`Received OFFER from ${from}`);
                await pc.setRemoteDescription(new RTCSessionDescription(data));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                addLog(`Sent ANSWER to ${from}`);
                socketRef.current.emit('signal', {
                    to: from,
                    data: answer
                });

                processIceQueue(pc, from);

            } else if (data.type === 'answer') {
                addLog(`Received ANSWER from ${from}`);
                await pc.setRemoteDescription(new RTCSessionDescription(data));
                processIceQueue(pc, from);

            } else if (data.candidate) {
                const candidate = new RTCIceCandidate(data.candidate);
                if (pc.remoteDescription && pc.remoteDescription.type) {
                    try {
                        await pc.addIceCandidate(candidate);
                    } catch (iceErr) { console.error("Error adding ICE", iceErr); }
                } else {
                    if (!iceCandidatesQueue.current[from]) iceCandidatesQueue.current[from] = [];
                    iceCandidatesQueue.current[from].push(candidate);
                }
            }
        } catch (err) {
            console.error("Signal Error:", err);
            addLog(`Signal Error: ${err.message}`);
        }
    };

    const processIceQueue = async (pc, from) => {
        if (iceCandidatesQueue.current[from]) {
            addLog(`Processing ${iceCandidatesQueue.current[from].length} queued ICE candidates`);
            while (iceCandidatesQueue.current[from].length > 0) {
                const candidate = iceCandidatesQueue.current[from].shift();
                try {
                    await pc.addIceCandidate(candidate);
                } catch (iceErr) {
                    console.error("Error adding queued ICE", iceErr);
                }
            }
            delete iceCandidatesQueue.current[from];
        }
    };

    const createPeerConnection = (remoteSocketId, remoteName, currentStream, isInitiator) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // Add local tracks
        currentStream.getTracks().forEach(track => pc.addTrack(track, currentStream));

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('signal', {
                    to: remoteSocketId,
                    data: { candidate: event.candidate }
                });
            }
        };

        // Handle remote stream
        pc.ontrack = (event) => {
            addLog(`Received stream from ${remoteName} (${remoteSocketId})`);
            const remoteStream = event.streams[0];

            setRemoteStreams(prev => {
                if (prev.find(s => s.id === remoteSocketId)) return prev;
                return [...prev, { id: remoteSocketId, name: remoteName, stream: remoteStream }];
            });
        };

        // Store peer connection
        const newPeer = { peerConnection: pc };
        peersRef.current[remoteSocketId] = newPeer;

        if (isInitiator) {
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .then(() => {
                    socketRef.current.emit('signal', {
                        to: remoteSocketId,
                        data: pc.localDescription
                    });
                    addLog(`Sent OFFER to ${remoteSocketId}`);
                })
                .catch(err => addLog(`Offer Error: ${err}`));
        }

        return newPeer;
    };

    const addLog = (message) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        }
    };

    const leaveRoom = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        // Stop media tracks explicitly
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Show feedback modal instead of direct navigation
        setShowFeedbackModal(true);
    };

    return (
        <div className="video-room-container">
            {/* Header */}
            <div className="video-room-header">
                <div>
                    <h2 className="room-title">Session: {sessionId}</h2>
                    <div className="status-indicator">
                        <span className={`status-dot ${status === 'Connected' ? 'status-connected' : 'status-disconnected'}`}></span>
                        <span className="status-text">{status}</span>
                        <span className="separator">|</span>
                        <span className="status-text">Name: {displayUserId}</span>
                    </div>
                </div>
                <div>
                    <button
                        onClick={leaveRoom}
                        className="leave-btn"
                    >
                        Leave Session
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="video-grid">
                {/* Local Video */}
                <div className="video-wrapper local-video-wrapper">
                    <video
                        playsInline
                        muted
                        ref={userVideo}
                        autoPlay
                        className="video-element local-video"
                    />
                    <div className="user-label">
                        You ({displayUserId})
                    </div>
                </div>

                {/* Remote Videos */}
                {remoteStreams.map(peer => (
                    <RemoteVideo key={peer.id} peer={peer} />
                ))}
            </div>

            {/* Controls */}
            <div className="controls-container">
                <button
                    onClick={toggleMute}
                    className="control-btn"
                    title="Toggle Mute"
                >
                    🎤
                </button>
                <button
                    onClick={toggleVideo}
                    className="control-btn"
                    title="Toggle Video"
                >
                    📷
                </button>
            </div>

            {showFeedbackModal && (
                <FeedbackModal
                    sessionId={sessionId}
                    participants={Array.from(allParticipants.current.values())}
                    currentUserId={user._id || user.id} // Ensure we have the DB ID from localStorage
                    onClose={() => navigate('/my-sessions')}
                />
            )}
        </div>
    );
};

const RemoteVideo = ({ peer }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current && peer.stream) {
            videoRef.current.srcObject = peer.stream;
        }
    }, [peer.stream]);

    return (
        <div className="video-wrapper remote-video-wrapper">
            <video
                playsInline
                ref={videoRef}
                autoPlay
                className="video-element"
            />
            <div className="user-label">
                {peer.name || `User: ${peer.id}`}
            </div>
        </div>
    );
};

export default VideoRoom;
