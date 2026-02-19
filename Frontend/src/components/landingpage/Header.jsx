import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Added import for logo
import '../../index.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check for user in sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
    transition: 'all 0.3s ease',
    padding: '1rem 0'
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--primary-color)',
    letterSpacing: '-0.02em',
    textDecoration: 'none'
  };

  const linkStyle = {
    margin: '0 1rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '0.95rem',
    textDecoration: 'none'
  };

  return (
    <header style={headerStyle}>
      <div className="container" style={navStyle}>
        <Link to="/" style={{ ...logoStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="Logo" style={{ height: '32px', width: 'auto' }} />
          SpeakSpace
        </Link>

        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={linkStyle}>Home</Link>
          <a href="/#how-it-works" style={linkStyle}>How It Works</a>
          <a href="/#sessions" style={linkStyle}>Sessions</a>
          <a href="/#about" style={linkStyle}>About</a>
        </nav>

        <div className="auth-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Login</button>
              </Link>
              <Link to="/create-account">
                <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

