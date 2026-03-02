import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css';

import logo from '../../assets/logo.png';

const TopNavbar = ({ user, toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Safely get user initials
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    const userName = user?.name || 'User';

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return null;
        if (avatarPath.startsWith('http')) return avatarPath;
        const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
        return `${BASE_URL}${avatarPath}`;
    };

    const avatarUrl = getAvatarUrl(user?.avatar);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Clear authentication token and user data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        // Redirect to public landing page
        navigate('/');
    };

    // Ref for the dropdown container
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <nav className="dashboard-navbar">
            <div className="nav-left" style={{ display: 'flex', alignItems: 'center' }}>
                <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <Link to="/dashboard" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <img src={logo} alt="Logo" style={{ height: '28px', width: 'auto' }} />
                    SpeakSpace
                </Link>
            </div>

            <div className="nav-center">
                <div className="nav-links">
                    <Link to="/dashboard" className="nav-item">Home</Link>
                    <Link to="/sessions" className="nav-item">Sessions</Link>
                    <Link to="/my-sessions" className="nav-item">My Sessions</Link>
                    <Link to="/progress" className="nav-item">Progress</Link>
                </div>
            </div>

            <div className="nav-right" style={{ position: 'relative' }} ref={dropdownRef}>
                <div
                    className="profile-btn"
                    onClick={toggleDropdown}
                    style={{ textDecoration: 'none' }}
                >
                    <div className="profile-avatar" style={{ overflow: 'hidden', padding: 0 }}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            userInitial
                        )}
                    </div>
                    <span className="profile-name">{userName.split(' ')[0]}</span>
                    {/* Optional chevron icon can be added here if available */}
                </div>

                {isDropdownOpen && (
                    <div className="profile-dropdown">
                        <div className="dropdown-header">
                            <div className="dropdown-user-name">{userName}</div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            My Profile
                        </Link>
                        <Link to="/settings" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            Settings
                        </Link>

                        <div className="dropdown-divider"></div>

                        <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default TopNavbar;
