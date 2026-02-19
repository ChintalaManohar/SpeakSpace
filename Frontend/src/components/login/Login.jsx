import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { GoogleLogin } from '@react-oauth/google';
import '../../index.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isAdmin: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            setLoading(false);
            if (response.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const pageStyle = {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-secondary)',
        padding: 'var(--spacing-md)'
    };

    const cardStyle = {
        backgroundColor: 'var(--bg-color)',
        padding: '2.5rem',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    };

    const inputGroupStyle = {
        marginBottom: '1rem',
        textAlign: 'left',
        position: 'relative' // For absolute positioning of icon
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: 'var(--text-secondary)',
        fontWeight: '500'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--border-radius)',
        border: '1px solid #e5e7eb',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
        outline: 'none'
    };

    const iconStyle = {
        position: 'absolute',
        right: '10px',
        top: '38px', // Adjust based on label height + padding
        cursor: 'pointer',
        color: '#6b7280'
    };

    const dividerStyle = {
        display: 'flex',
        alignItems: 'center',
        margin: '1.5rem 0',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
    };

    const lineStyle = {
        flex: 1,
        height: '1px',
        backgroundColor: '#e5e7eb'
    };

    const errorStyle = {
        color: '#dc2626',
        backgroundColor: '#fee2e2',
        padding: '0.75rem',
        borderRadius: 'var(--border-radius)',
        marginBottom: '1rem',
        fontSize: '0.9rem'
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const { credential } = credentialResponse;
            const response = await api.post('/auth/google', {
                token: credential
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Google Login failed');
            console.error('Google Login Error:', err);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed');
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Login to SpeakSpace</h2>

                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            style={inputStyle}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleNameChange}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            style={inputStyle}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleNameChange}
                            required
                        />
                        <span
                            style={iconStyle}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </span>
                    </div>

                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name="isAdmin"
                            id="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleNameChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="isAdmin" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Log in as Admin</label>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={dividerStyle}>
                    <span style={lineStyle}></span>
                    <span style={{ padding: '0 0.5rem' }}>OR</span>
                    <span style={lineStyle}></span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        theme="outline"
                        width="320"
                    />
                </div>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/create-account" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
