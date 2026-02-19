import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import '../../index.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') {
        return null;
    }

    const sidebarStyle = {
        width: '250px',
        height: '100vh',
        backgroundColor: 'var(--bg-color)',
        borderRight: '1px solid #e5e7eb',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem'
    };

    const mainContentStyle = {
        marginLeft: '250px',
        padding: '2rem',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)'
    };

    const linkStyle = (isActive) => ({
        display: 'block',
        padding: '0.75rem 1rem',
        marginBottom: '0.5rem',
        borderRadius: 'var(--border-radius)',
        textDecoration: 'none',
        color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
        fontWeight: isActive ? 600 : 500
    });

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <div style={sidebarStyle}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Admin Panel</h2>
                <nav style={{ flex: 1 }}>
                    <Link to="/admin/dashboard" style={linkStyle(location.pathname === '/admin/dashboard')}>
                        Dashboard
                    </Link>
                    <Link to="/admin/sessions" style={linkStyle(location.pathname === '/admin/sessions')}>
                        Manage Sessions
                    </Link>
                    <Link to="/admin/users" style={linkStyle(location.pathname === '/admin/users')}>
                        View Users
                    </Link>
                </nav>
                <button onClick={logout} className="btn" style={{ marginTop: 'auto', border: '1px solid currentColor' }}>
                    Logout
                </button>
            </div>
            <div style={mainContentStyle}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
