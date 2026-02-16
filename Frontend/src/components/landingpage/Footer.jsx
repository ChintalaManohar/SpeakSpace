import React from 'react';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#111827',
        color: '#9CA3AF',
        padding: 'var(--spacing-lg) 0',
        fontSize: '0.9rem'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: 'var(--spacing-md)'
    };

    const titleStyle = {
        color: 'white',
        marginBottom: '1rem',
        fontWeight: 'bold'
    };

    const listStyle = {
        listStyle: 'none',
        padding: 0
    };

    const listItemStyle = {
        marginBottom: '0.5rem'
    };

    return (
        <footer style={footerStyle}>
            <div className="container">
                <div style={gridStyle}>
                    <div>
                        <div style={{ ...titleStyle, fontSize: '1.25rem' }}>SpeakSpace</div>
                        <p>Building confidence, one conversation at a time.</p>
                    </div>
                    <div>
                        <div style={titleStyle}>Platform</div>
                        <ul style={listStyle}>
                            <li style={listItemStyle}><a href="#">How It Works</a></li>
                            <li style={listItemStyle}><a href="#">Sessions</a></li>
                            <li style={listItemStyle}><a href="#">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <div style={titleStyle}>Company</div>
                        <ul style={listStyle}>
                            <li style={listItemStyle}><a href="#">About Us</a></li>
                            <li style={listItemStyle}><a href="#">Contact</a></li>
                            <li style={listItemStyle}><a href="#">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <div style={titleStyle}>Legal</div>
                        <ul style={listStyle}>
                            <li style={listItemStyle}><a href="#">Privacy Policy</a></li>
                            <li style={listItemStyle}><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', textAlign: 'center' }}>
                    &copy; {new Date().getFullYear()} SpeakSpace. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
