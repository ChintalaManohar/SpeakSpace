import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSessions: 0,
        activeSessions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCardStyle = {
        backgroundColor: 'var(--bg-color)',
        padding: '1.5rem',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-md)',
        flex: 1,
        minWidth: '200px'
    };

    if (loading) return <div>Loading stats...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={statCardStyle}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {stats.totalUsers}
                    </p>
                </div>
                <div style={statCardStyle}>
                    <h3>Total Sessions</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {stats.totalSessions}
                    </p>
                </div>
                <div style={statCardStyle}>
                    <h3>Active/Upcoming Sessions</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {stats.activeSessions}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
