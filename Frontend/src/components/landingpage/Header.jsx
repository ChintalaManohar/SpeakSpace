import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Added import for logo
import '../../index.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`landing-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container landing-nav">
        <Link to="/" className="landing-logo">
          <img src={logo} alt="Logo" />
          SpeakSpace
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/">Home</Link>
          <a href="/#how-it-works">How It Works</a>
          <a href="/#sessions">Sessions</a>
          <a href="/#about">About</a>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/login">
            <button className="btn btn-secondary">Login</button>
          </Link>
          <Link to="/create-account">
            <button className="btn btn-primary">Get Started</button>
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <Link to="/" onClick={toggleMobileMenu}>Home</Link>
            <a href="/#how-it-works" onClick={toggleMobileMenu}>How It Works</a>
            <a href="/#sessions" onClick={toggleMobileMenu}>Sessions</a>
            <a href="/#about" onClick={toggleMobileMenu}>About</a>

            <div className="mobile-auth-buttons">
              <Link to="/login" onClick={toggleMobileMenu}>
                <button className="btn btn-secondary">Login</button>
              </Link>
              <Link to="/create-account" onClick={toggleMobileMenu}>
                <button className="btn btn-primary">Get Started</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

