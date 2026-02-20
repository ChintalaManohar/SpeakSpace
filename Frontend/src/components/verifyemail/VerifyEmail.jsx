import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './VerifyEmail.css'; // We'll create a simple CSS file

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('loading'); // loading, success, error

    const hasCalled = React.useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/auth/verify-email/${token}`);
                setMessage(response.data.message);

                if (response.data.token) {
                    sessionStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('user', JSON.stringify({
                        _id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        role: response.data.role
                    }));

                    // Auto-redirect after brief delay to show success message
                    setTimeout(() => {
                        if (response.data.role === 'admin') {
                            navigate('/admin/dashboard');
                        } else {
                            navigate('/dashboard');
                        }
                    }, 2000);
                }

                setStatus('success');
            } catch (error) {
                setMessage(error.response?.data?.message || 'Verification failed. Link may be invalid or expired.');
                setStatus('error');
            }
        };

        if (token && !hasCalled.current) {
            hasCalled.current = true;
            verifyEmail();
        }
    }, [token]);

    return (
        <div className="verify-email-container">
            <div className={`verify-card ${status}`}>
                <h2>Email Verification</h2>
                {status === 'loading' && <p>Verifying your email...</p>}

                {status === 'success' && (
                    <div className="status-content">
                        <div className="icon-circle success">✓</div>
                        <p>{message}</p>
                        <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9em' }}>Redirecting to your dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="status-content">
                        <div className="icon-circle error">✕</div>
                        <p>{message}</p>
                        <Link to="/create-account" className="btn-secondary">Register Again</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
