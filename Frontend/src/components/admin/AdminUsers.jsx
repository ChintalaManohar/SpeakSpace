import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'var(--bg-color)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
    };

    const thStyle = {
        backgroundColor: '#f9fafb',
        padding: '1rem',
        textAlign: 'left',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        borderBottom: '1px solid #e5e7eb'
    };

    const tdStyle = {
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        color: 'var(--text-primary)'
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Registered Users</h1>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Joined Date</th>
                        <th style={thStyle}>Sessions Attended</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td style={tdStyle}>{user.name}</td>
                            <td style={tdStyle}>{user.email}</td>
                            <td style={tdStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td style={tdStyle}>{user.sessionsAttended}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
