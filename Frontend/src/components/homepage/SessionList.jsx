import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import SessionCard from './SessionCard';
import './dashboard.css';

const SessionList = ({ activeTab }) => {
    const [sessions, setSessions] = useState([]);
    const [bookedSessionIds, setBookedSessionIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const typeMapping = {
                    'group': 'group_discussion',
                    'debate': 'debate'
                };
                const backendType = typeMapping[activeTab] || 'group_discussion';

                // Fetch all sessions
                const sessionsPromise = api.get(`/sessions?type=${backendType}`);

                // Fetch user's booked sessions to identify what they've booked
                const token = localStorage.getItem('token');
                let bookedPromise = Promise.resolve({ data: [] });

                if (token) {
                    bookedPromise = api.get('/sessions/my-sessions')
                        .catch(err => {
                            console.warn("Failed to fetch booked sessions:", err);
                            return { data: [] }; // Return empty data on failure
                        });
                }

                const [sessionsRes, bookedRes] = await Promise.all([sessionsPromise, bookedPromise]);

                setSessions(sessionsRes.data);

                // Create a Set of booked session IDs for efficient lookup
                const bookedIds = new Set(bookedRes.data.map(s => s._id));
                setBookedSessionIds(bookedIds);

                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load sessions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    if (loading) {
        return <div className="sessions-loading">Loading sessions...</div>;
    }

    if (error) {
        return <div className="sessions-error">{error}</div>;
    }

    // Format session data to match SessionCard expectations if needed
    // The backend returns:
    // { _id, type, topic, startTime, duration, level, maxSlots, bookedSlots, meetLink, status }
    // SessionCard expects:
    // { id, type, topic, time, level, slotsLeft, totalSlots, isLive, isBooked }

    // We can map the data here before rendering
    // Filter out Live sessions (and Completed, though backend already does that)
    const availableSessions = sessions;

    const mappedSessions = availableSessions.map(session => {
        const startTime = new Date(session.startTime);

        // Format time string (e.g., "Today · 6:00 PM")
        // For simplicity, just using locale string for now, user can refine
        const timeOptions = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const timeString = startTime.toLocaleDateString('en-US', timeOptions);

        return {
            id: session._id, // MongoDB _id
            type: session.type === 'group_discussion' ? 'group' : 'debate',
            topic: session.topic,
            time: timeString,
            level: session.level,
            slotsLeft: session.maxSlots - session.bookedSlots,
            totalSlots: session.maxSlots,
            isLive: session.status === 'Live',
            startTime: session.startTime,
            isBooked: bookedSessionIds.has(session._id)
        };
    });

    return (
        <div className="sessions-grid">
            {mappedSessions.length > 0 ? (
                mappedSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))
            ) : (
                <div className="empty-state-text">No {activeTab} sessions available at the moment.</div>
            )}
        </div>
    );
};

export default SessionList;
