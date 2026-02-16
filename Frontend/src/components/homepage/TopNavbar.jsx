import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css';

import logo from '../../assets/logo.png';

const TopNavbar = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Safely get user initials
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    const userName = user?.name || 'User';

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Clear authentication token and user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

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
            <div className="nav-left">
                <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={logo} alt="Logo" style={{ height: '28px', width: 'auto' }} />
                    SpeakSpace
                </div>
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
                    <div className="profile-avatar">
                        {userInitial}
                    </div>
                    <span className="profile-name">{userName.split(' ')[0]}</span>
                    {/* Optional chevron icon can be added here if available */}
                </div>

                {isDropdownOpen && (
                    <div className="profile-dropdown">
                        <div className="dropdown-header">
                            <div className="dropdown-user-name">{userName}</div>
                            {/* <div className="dropdown-user-email">{user?.email || 'user@example.com'}</div> */}
                        </div>

                        <div className="dropdown-divider"></div>

                        <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            My Profile
                        </Link>
                        <Link to="/settings" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            Settings
                        </Link>

                        <div className="dropdown-divider"></div>

                        <Link to="/help" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            Help / Guide
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
