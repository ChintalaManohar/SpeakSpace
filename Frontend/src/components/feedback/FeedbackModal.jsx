import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FeedbackUserCard from './FeedbackUserCard';
import './Feedback.css';

const FeedbackModal = ({ sessionId, currentUserId, onClose }) => {
    const navigate = useNavigate();
    const [feedbackData, setFeedbackData] = useState({});
    const [openUserId, setOpenUserId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [peers, setPeers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch session details to get attendedParticipants
    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const res = await axios.get(`http://localhost:5000/api/sessions/${sessionId}`, config);
                const sessionFn = res.data;

                // Filter out current user from attendedParticipants
                // Note: sessionFn.attendedParticipants should be populated
                const attendees = sessionFn.attendedParticipants || [];
                const filteredPeers = attendees.filter(p => p._id !== currentUserId && p.id !== currentUserId);

                // Map to consistent format if needed (Mongo uses _id, but some parts might use id)
                const mappedPeers = filteredPeers.map(p => ({
                    id: p._id || p.id,
                    name: p.name,
                    email: p.email
                }));

                setPeers(mappedPeers);

                // Initialize feedback state for new peers
                const initialFeedback = {};
                mappedPeers.forEach(peer => {
                    initialFeedback[peer.id] = {
                        confidence: 0,
                        clarity: 0,
                        listening: 0,
                        comment: ''
                    };
                });
                setFeedbackData(initialFeedback);

                // Open first user by default if exists
                if (mappedPeers.length > 0) {
                    setOpenUserId(mappedPeers[0].id);
                }

            } catch (err) {
                console.error("Error fetching session details:", err);
                setError("Failed to load participant list.");
            } finally {
                setLoading(false);
            }
        };

        fetchSessionDetails();
    }, [sessionId, currentUserId]);

    const handleFeedbackChange = (userId, field, value) => {
        setFeedbackData(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value
            }
        }));
    };

    const toggleAccordion = (userId) => {
        setOpenUserId(prev => (prev === userId ? null : userId));
    };

    const validateFeedback = () => {
        for (const peer of peers) {
            const data = feedbackData[peer.id];
            if (!data || data.confidence === 0 || data.clarity === 0 || data.listening === 0) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateFeedback()) {
            setError('Please provide a rating for all criteria for every participant.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const feedbackArray = peers.map(peer => ({
            sessionId,
            toUser: peer.id,
            ...feedbackData[peer.id]
        }));

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post('http://localhost:5000/api/feedback', { feedbackArray }, config);

            alert('Feedback submitted successfully!');
            onClose(); // In VideoRoom this redirects to my-sessions
        } catch (err) {
            console.error('Feedback submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (peers.length === 0) {
        return (
            <div className="feedback-modal-overlay">
                <div className="feedback-modal">
                    <h2>Session Ended</h2>
                    <p>No other participants to rate.</p>
                    <button onClick={onClose} className="submit-btn">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal">
                <div className="modal-header">
                    <h2>Session Feedback</h2>
                    <p className="subtitle">Rate your peers to help them improve</p>
                </div>

                <div className="participants-list">
                    {peers.map(peer => (
                        <FeedbackUserCard
                            key={peer.id}
                            user={peer}
                            feedback={feedbackData[peer.id]}
                            onChange={handleFeedbackChange}
                            isOpen={openUserId === peer.id}
                            onToggle={() => toggleAccordion(peer.id)}
                        />
                    ))}
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-footer">
                    <button
                        onClick={handleSubmit}
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
