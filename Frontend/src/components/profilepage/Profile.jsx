import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import TopNavbar from '../homepage/TopNavbar';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || {});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        about: user.about || '',
        avatar: null
    });
    const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    const [preview, setPreview] = useState(user.avatar ? `${BASE_URL}${user.avatar}` : null);
    const [loading, setLoading] = useState(false);
    const [activityStats, setActivityStats] = useState({
        week: { group_discussion: 0, debate: 0 },
        month: { group_discussion: 0, debate: 0 },
        year: { group_discussion: 0, debate: 0 }
    });

    useEffect(() => {
        // Fetch latest user data and activity stats
        const fetchData = async () => {
            try {
                // Fetch user profile
                const { data: userData } = await api.get('/auth/me');

                // Fetch activity stats
                const { data: activityData } = await api.get('/auth/activity');
                setActivityStats(activityData);

                // Merge existing user data (like token) with new profile data
                const updatedUser = { ...user, ...userData };

                // Update state
                setUser(updatedUser);

                // Persist to session storage so data survives refresh
                sessionStorage.setItem('user', JSON.stringify(updatedUser));

                setFormData({
                    name: userData.name || '',
                    about: userData.about || '',
                    avatar: null
                });
                if (userData.avatar) {
                    setPreview(`${BASE_URL}${userData.avatar}`);
                }
            } catch (error) {
                console.error("Error fetching data", error);
                // If token is invalid/expired, clear session storage
                if (error.response && error.response.status === 401) {
                    sessionStorage.removeItem('user');
                    setUser({});
                }
            }
        };

        if (user.token) {
            fetchData();
        }
    }, [user.token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('about', formData.about);
        if (formData.avatar) {
            data.append('avatar', formData.avatar);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await api.put('/auth/profile', data, config);

            // Update session storage and state
            const updatedUser = { ...user, ...response.data };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
            setLoading(false);
        } catch (error) {
            console.error("Error updating profile", error);
            setLoading(false);
        }
    };

    // Calculate joined date
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Aug 2026';

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name || '',
            about: user.about || '',
            avatar: null
        });
        setPreview(user.avatar ? `${BASE_URL}${user.avatar}` : null);
    };

    return (
        <div className="profile-page-container">
            <TopNavbar user={user} />

            <div className="profile-main-content">

                <div className="profile-card-centered">

                    {/* Header with Background & Avatar */}
                    <div className="profile-header-new">
                        <div className="profile-cover-new"></div>
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar-clickable" style={{ cursor: 'default' }}>
                                {preview ? (
                                    <img src={preview} alt="Profile" className="profile-avatar-img" />
                                ) : (
                                    <div className="profile-avatar-placeholder">{getInitials(user.name)}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Details Section */}
                    <div className="profile-section-new user-details-card">
                        <div className="user-details-content">
                            <h2 className="user-display-name">{user.name}</h2>
                            <p className="user-email">{user.email}</p>
                            <p className="user-joined">Joined: {joinedDate}</p>
                            {user.about && <p className="user-about">{user.about}</p>}
                        </div>
                        <button className="edit-details-btn" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    </div>

                    {/* Activity Section */}
                    <div className="profile-section-new activity-card">
                        <h3 className="section-title">Activity</h3>

                        <div className="activity-row">
                            <div className="activity-group">
                                <h4>Group Discussion</h4>
                                <div className="activity-bars">
                                    <div className="bar-item">
                                        <span>Week</span>
                                        <div className="progress-bar"><div className="fill" style={{ width: `${Math.min((activityStats.week.group_discussion / 5) * 100, 100)}%` }}></div></div>
                                        <span>{activityStats.week.group_discussion}</span>
                                    </div>
                                    <div className="bar-item">
                                        <span>Month</span>
                                        <div className="progress-bar"><div className="fill" style={{ width: `${Math.min((activityStats.month.group_discussion / 15) * 100, 100)}%` }}></div></div>
                                        <span>{activityStats.month.group_discussion}</span>
                                    </div>
                                    <div className="bar-item">
                                        <span>Year</span>
                                        <div className="progress-bar"><div className="fill" style={{ width: `${Math.min((activityStats.year.group_discussion / 50) * 100, 100)}%` }}></div></div>
                                        <span>{activityStats.year.group_discussion}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="activity-divider"></div>

                            <div className="activity-group">
                                <h4>Debate</h4>
                                <div className="activity-bars">
                                    <div className="bar-item">
                                        <span>Week</span>
                                        <div className="progress-bar"><div className="fill" style={{ width: `${Math.min((activityStats.week.debate / 5) * 100, 100)}%` }}></div></div>
                                        <span>{activityStats.week.debate}</span>
                                    </div>
                                    <div className="bar-item">
                                        <span>Month</span>
                                        <div className="progress-bar"><div className="fill" style={{ width: `${Math.min((activityStats.month.debate / 15) * 100, 100)}%` }}></div></div>
                                        <span>{activityStats.month.debate}</span>
                                    </div>
                                    <div className="bar-item">
                                        <span>Year</span>
                                        <div className="progress-bar"><div className="fill" style={{ width: `${Math.min((activityStats.year.debate / 50) * 100, 100)}%` }}></div></div>
                                        <span>{activityStats.year.debate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <label style={{ marginBottom: '1rem', display: 'block' }}>Profile Picture</label>
                                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid #e5e7eb' }}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#4f46e5' }}>
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="modal-avatar-upload"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.7rem', padding: '2px 0', textAlign: 'center', pointerEvents: 'none' }}>
                                        Change
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>About</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Tell us about yourself..."
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
