import React from 'react';
import '../../index.css';

const Hero = () => {
    const sectionStyle = {
        padding: 'var(--spacing-xl) 0',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--secondary-color) 0%, rgba(255,255,255,0) 100%)'
    };

    const heroContentStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 var(--spacing-sm)'
    };

    const headingStyle = {
        marginBottom: 'var(--spacing-sm)',
        color: 'var(--text-primary)',
        lineHeight: '1.1'
    };

    const subHeadingStyle = {
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-md)',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
    };

    const ctaGroupStyle = {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginTop: 'var(--spacing-md)'
    };

    return (
        <section style={sectionStyle}>
            <div className="container">
                <div style={heroContentStyle}>
                    <h1 style={headingStyle}>
                        Learn communication by doing.<br />
                        <span style={{ color: 'var(--primary-color)' }}>Build confidence.</span>
                    </h1>
                    <p style={subHeadingStyle}>
                        Practice real conversations through group discussions and debates
                        in a safe, supportive environment.
                    </p>
                    <div style={ctaGroupStyle}>
                        <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            Join a Session
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                            onClick={() => {
                                const element = document.getElementById('how-it-works');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            How It Works
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
