import React, { useState } from 'react';
import './dashboard.css';

import axios from 'axios';

const SessionCard = ({ session }) => {
    const [isBooked, setIsBooked] = useState(session.isBooked || false);
    const [loading, setLoading] = useState(false);
    const [slotsLeft, setSlotsLeft] = useState(session.slotsLeft);

    const handleBooking = async () => {
        if (!isBooked && !session.isLive && slotsLeft > 0) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Please login to book a session');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                await axios.post(`http://localhost:5000/api/sessions/${session.id}/book`, {}, config);

                setIsBooked(true);
                setSlotsLeft(prev => Math.max(0, prev - 1));
                alert('Session booked successfully!');
            } catch (error) {
                console.error("Error booking session:", error);
                const msg = error.response?.data?.message || 'Failed to book session';
                alert(msg);
                if (msg.includes("already booked")) {
                    setIsBooked(true);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="session-card-row">
            {/* Left: Badge and Title */}
            <div className="card-left">
                <span className="card-badge">
                    {session.type === 'group' ? 'GROUP DISCUSSION' : 'DEBATE'}
                </span>
                <h3 className="card-title-row">{session.topic}</h3>
            </div>

            {/* Middle: Details with Icons */}
            <div className="card-middle">
                <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="detail-icon">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{session.time}</span>
                </div>

                <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="detail-icon">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>{session.level || 'Beginner'}</span>
                </div>

                <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="detail-icon">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Slots left: {slotsLeft} / {session.totalSlots || 6}</span>
                </div>
            </div>

            {/* Right: Button */}
            <div className="card-right">
                <button
                    className={`action-btn ${isBooked ? 'booked-btn' : (slotsLeft === 0 ? 'full-btn' : 'book-btn-dark')}`}
                    onClick={handleBooking}
                    disabled={loading || isBooked || slotsLeft === 0}
                >
                    {loading ? 'Booking...' : (isBooked ? 'Booked' : (slotsLeft === 0 ? 'Full' : 'Book Slot'))}
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
