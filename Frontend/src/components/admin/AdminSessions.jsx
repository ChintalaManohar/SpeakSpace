import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editSessionId, setEditSessionId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'group_discussion',
        topic: '',
        type: 'group_discussion',
        topic: '',
        date: '',
        hour: '12',
        minute: '00',
        ampm: 'AM',
        duration: 30,
        level: 'Intermediate',
        maxSlots: 10,
        meetLink: ''
    });

    const fetchSessions = async () => {
        try {
            const { data } = await api.get('/admin/sessions');
            setSessions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                await api.delete(`/admin/sessions/${id}`);
                fetchSessions();
            } catch (error) {
                console.error('Error deleting session:', error);
                alert('Failed to delete session');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let h = parseInt(formData.hour);
            if (formData.ampm === 'PM' && h < 12) h += 12;
            if (formData.ampm === 'AM' && h === 12) h = 0;

            const timeString = `${h.toString().padStart(2, '0')}:${formData.minute.toString().padStart(2, '0')}`;
            const combinedStartTime = new Date(`${formData.date}T${timeString}`);

            const payload = { ...formData, startTime: combinedStartTime };
            delete payload.date;
            delete payload.hour;
            delete payload.minute;
            delete payload.ampm;

            if (editSessionId) {
                await api.put(`/admin/sessions/${editSessionId}`, payload);
                alert('Session updated successfully');
            } else {
                await api.post('/admin/sessions', payload);
                alert('Session created successfully');
            }

            setShowForm(false);
            setEditSessionId(null);
            setFormData({
                type: 'group_discussion',
                topic: '',
                date: '',
                hour: '12',
                minute: '00',
                ampm: 'AM',
                duration: 30,
                level: 'Intermediate',
                maxSlots: 10,
                meetLink: ''
            });
            fetchSessions();
        } catch (error) {
            console.error('Error saving session:', error);
            alert('Failed to save session');
        }
    };

    const handleEdit = (session) => {
        const dateObj = new Date(session.startTime);

        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        const dateStr = dateObj.toISOString().split('T')[0];

        setFormData({
            type: session.type,
            topic: session.topic,
            date: dateStr,
            hour: hours.toString(),
            minute: minutes.toString().padStart(2, '0'),
            ampm: ampm,
            duration: session.duration,
            level: session.level,
            maxSlots: session.maxSlots,
            meetLink: session.meetLink
        });
        setEditSessionId(session._id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            type: 'group_discussion',
            topic: '',
            date: '',
            hour: '12',
            minute: '00',
            ampm: 'AM',
            duration: 30,
            level: 'Intermediate',
            maxSlots: 10,
            meetLink: ''
        });
        setEditSessionId(null);
        setShowForm(false);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'var(--bg-color)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginTop: '2rem'
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

    const formStyle = {
        backgroundColor: 'var(--bg-color)',
        padding: '2rem',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        borderRadius: 'var(--border-radius)',
        border: '1px solid #e5e7eb'
    };

    if (loading) return <div>Loading sessions...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manage Sessions</h1>
                <button className="btn btn-primary" onClick={() => {
                    if (showForm) resetForm();
                    else setShowForm(true);
                }}>
                    {showForm ? 'Cancel' : 'Create New Session'}
                </button>
            </div>

            {showForm && (
                <div style={formStyle}>
                    <h3>{editSessionId ? 'Edit Session' : 'Create New Session'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Session Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                                    <option value="group_discussion">Group Discussion</option>
                                    <option value="debate">Debate</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Topic</label>
                                <input type="text" name="topic" placeholder="e.g. AI in Healthcare" value={formData.topic} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Time</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        name="hour"
                                        min="1"
                                        max="12"
                                        placeholder="HH"
                                        value={formData.hour}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, marginBottom: 0, width: '33%' }}
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="minute"
                                        min="0"
                                        max="59"
                                        placeholder="MM"
                                        value={formData.minute}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, marginBottom: 0, width: '33%' }}
                                        required
                                    />
                                    <select
                                        name="ampm"
                                        value={formData.ampm}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, marginBottom: 0, width: '33%' }}
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Duration (minutes)</label>
                                <input type="number" name="duration" placeholder="30" value={formData.duration} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Difficulty Level</label>
                                <select name="level" value={formData.level} onChange={handleChange} style={inputStyle}>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Max Participants</label>
                                <input type="number" name="maxSlots" placeholder="10" value={formData.maxSlots} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Meeting Link</label>
                                <input type="text" name="meetLink" placeholder="https://meet.google.com/..." value={formData.meetLink} onChange={handleChange} style={inputStyle} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            {editSessionId ? 'Update Session' : 'Create Session'}
                        </button>
                    </form>
                </div>
            )}

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Date & Time</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Topic</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Participants</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr key={session._id}>
                            <td style={tdStyle}>
                                {new Date(session.startTime).toLocaleDateString()} <br />
                                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td style={tdStyle}>{session.type}</td>
                            <td style={tdStyle}>{session.topic}</td>
                            <td style={tdStyle}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.85rem',
                                    backgroundColor: session.status === 'scheduled' ? '#dbeafe' : '#fecaca',
                                    color: session.status === 'scheduled' ? '#1e40af' : '#991b1b'
                                }}>
                                    {session.status}
                                </span>
                            </td>
                            <td style={tdStyle}>{session.bookedSlots} / {session.maxSlots}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => handleEdit(session)}
                                    style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginRight: '1rem' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(session._id)}
                                    style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSessions;
