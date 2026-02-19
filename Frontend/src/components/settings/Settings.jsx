import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // Form States
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [settings, setSettings] = useState({
        notifications: { sessionReminders: true, feedback: true },
        media: { defaultMic: true, defaultCamera: true },
        privacy: { profileVisibility: 'public' },
        theme: 'light'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/auth/me', config);

                setUser(res.data);
                if (res.data.settings) {
                    setSettings(prev => ({ ...prev, ...res.data.settings }));
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data", err);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const clearMessage = () => {
        setTimeout(() => setMessage(null), 5000);
    };

    // --- Account Handlers ---

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            clearMessage();
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put('http://localhost:5000/api/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, config);

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
        }
        clearMessage();
    };

    const resendVerification = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/auth/resend-verification', {}, config);
            setMessage({ type: 'success', text: 'Verification email sent!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send email' });
        }
        clearMessage();
    };

    // --- Settings Handlers ---

    const handleToggle = (category, field) => {
        const newSettings = {
            ...settings,
            [category]: {
                ...settings[category],
                [field]: !settings[category][field]
            }
        };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const handleSelectChange = (category, field, value) => {
        const newSettings = {
            ...settings,
            [category]: {
                ...settings[category],
                [field]: value
            }
        };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const handleThemeChange = (value) => {
        const newSettings = { ...settings, theme: value };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const saveSettings = async (newSettings) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put('http://localhost:5000/api/auth/settings', { settings: newSettings }, config);
            // Optional: Update local user context if exists
        } catch (err) {
            console.error("Failed to save settings", err);
            // Optionally show error to user, but usually auto-save is silent or subtle
        }
    };

    if (loading) return <div className="settings-container">Loading...</div>;

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* 1. Account Settings */}
            <div className="settings-section">
                <div className="section-header">
                    <span className="section-icon">🔐</span>
                    <h2 className="section-title">Account Security</h2>
                </div>

                <div className="account-info-row">
                    <span className="info-label">Email Status</span>
                    {user?.isVerified ? (
                        <div className="status-verified">
                            <span>✅ Verified</span>
                        </div>
                    ) : (
                        <div className="status-unverified">
                            <span>❌ Not Verified</span>
                            <button onClick={resendVerification} className="resend-btn">Resend Email</button>
                        </div>
                    )}
                </div>

                <form onSubmit={submitPasswordChange} className="password-form">
                    <h3>Change Password</h3>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button type="submit" className="change-password-btn">Update Password</button>
                </form>
            </div>

            {/* 2. Preferences */}
            <div className="settings-section">
                <div className="section-header">
                    <span className="section-icon">🔔</span>
                    <h2 className="section-title">Preferences</h2>
                </div>

                <div className="setting-item">
                    <span className="setting-label">Session Reminders</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={settings.notifications?.sessionReminders}
                            onChange={() => handleToggle('notifications', 'sessionReminders')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <span className="setting-label">Feedback Notifications</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={settings.notifications?.feedback}
                            onChange={() => handleToggle('notifications', 'feedback')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '16px' }}>Media Defaults</h3>
                <div className="setting-item">
                    <span className="setting-label">Default Microphone ON</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={settings.media?.defaultMic}
                            onChange={() => handleToggle('media', 'defaultMic')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <span className="setting-label">Default Camera ON</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={settings.media?.defaultCamera}
                            onChange={() => handleToggle('media', 'defaultCamera')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {/* 3. Privacy */}
            <div className="settings-section">
                <div className="section-header">
                    <span className="section-icon">👁</span>
                    <h2 className="section-title">Privacy</h2>
                </div>

                <div className="setting-item">
                    <span className="setting-label">Profile Visibility</span>
                    <select
                        className="privacy-select"
                        value={settings.privacy?.profileVisibility}
                        onChange={(e) => handleSelectChange('privacy', 'profileVisibility', e.target.value)}
                    >
                        <option value="public">Visible to Everyone</option>
                        <option value="private">Private (Participants Only)</option>
                    </select>
                </div>
            </div>

            {/* 4. App Settings */}
            <div className="settings-section">
                <div className="section-header">
                    <span className="section-icon">🎨</span>
                    <h2 className="section-title">App Settings</h2>
                </div>

                <div className="setting-item">
                    <span className="setting-label">Theme</span>
                    <select
                        className="privacy-select"
                        value={settings.theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                    >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode (Beta)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
