import React from 'react';

const FinalCTA = () => {
    const sectionStyle = {
        padding: 'var(--spacing-xl) 0',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
        color: 'white'
    };

    const headingStyle = {
        color: 'white',
        marginBottom: 'var(--spacing-sm)'
    };

    return (
        <section style={sectionStyle}>
            <div className="container">
                <h2 style={headingStyle}>Your confidence grows when you practice.</h2>
                <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)' }}>
                        Join Your First Session
                    </button>
                    <button className="btn" style={{ border: '1px solid white', color: 'white' }}>
                        Create an Account
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
