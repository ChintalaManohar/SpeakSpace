import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import './dashboard.css';

const MySessions = () => {
    const [activeTab, setActiveTab] = useState('group'); // 'group' or 'debate'
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

    const [bookedSessions, setBookedSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMySessions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:5000/api/sessions/my-sessions', config);
                setBookedSessions(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching my sessions:", err);
                setError("Failed to load your sessions.");
            } finally {
                setLoading(false);
            }
        };

        fetchMySessions();
    }, []);

    // Helper to format date and time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
    };

    // Filter sessions based on active tab and status
    // Backend returns all booked sessions with a 'status' field ('Upcoming', 'Live', 'Completed')
    // We filter based on current tab (group/debate) first

    const filteredSessions = bookedSessions.filter(session => {
        const typeMatch = (activeTab === 'group' && session.type === 'group_discussion') ||
            (activeTab === 'debate' && session.type === 'debate');
        return typeMatch;
    });

    const upcomingSessions = filteredSessions.filter(s => s.status === 'Upcoming' || s.status === 'Live');
    const pastSessions = filteredSessions.filter(s => s.status === 'Completed');

    return (
        <div className="dashboard-container">
            <TopNavbar user={user} />

            <div className="dashboard-main">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    title="My Sessions"
                />

                <main className="content-area sessions-content">
                    <h2 className="section-heading" style={{ marginTop: '0' }}>My Upcoming Sessions</h2>

                    {loading ? (
                        <div className="sessions-loading">Loading your sessions...</div>
                    ) : error ? (
                        <div className="sessions-error">{error}</div>
                    ) : (
                        <div className="sessions-grid">
                            {upcomingSessions.length > 0 ? (
                                upcomingSessions.map(session => {
                                    const { date, time } = formatDateTime(session.startTime);
                                    return (
                                        <div key={session._id} className="session-card-row">
                                            <div className="card-left">
                                                <span className={`card-badge ${session.status === 'Live' ? 'live-badge' : ''}`}>
                                                    {session.status === 'Live' ? 'Live Now' : (session.type === 'group_discussion' ? 'group' : 'debate')}
                                                </span>
                                                <h3 className="card-title-row">{session.topic}</h3>
                                            </div>
                                            <div className="card-middle">
                                                <div className="detail-item">
                                                    <span>📅 {date}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span>⏰ {time}</span>
                                                </div>
                                            </div>
                                            <div className="card-right">
                                                {session.status === 'Live' ? (
                                                    <Link to={`/session/${session._id}`}>
                                                        <button className="action-btn join-btn">Join Now</button>
                                                    </Link>
                                                ) : (
                                                    <button className="action-btn booked-btn">Booked</button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="empty-state-text">No upcoming {activeTab} sessions.</p>
                            )}
                        </div>
                    )}

                    <h2 className="section-heading" style={{ marginTop: '3rem' }}>Past Sessions</h2>

                    <div className="sessions-grid">
                        {pastSessions.length > 0 ? (
                            pastSessions.map(session => {
                                const { date } = formatDateTime(session.startTime);
                                return (
                                    <div key={session._id} className="session-card-row past-session-card">
                                        <div className="card-left">
                                            <span className="card-badge overdue-badge">Completed</span>
                                            <h3 className="card-title-row" style={{ color: '#6B7280' }}>{session.topic}</h3>
                                        </div>
                                        <div className="card-middle">
                                            <div className="detail-item">
                                                <span>📅 {date}</span>
                                            </div>
                                        </div>
                                        <div className="card-right">
                                            <span className="session-status-text">Completed</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="empty-state-text">No past {activeTab} sessions.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MySessions;
