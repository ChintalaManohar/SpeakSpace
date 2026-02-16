import React from 'react';

const HowItWorks = () => {
    const sectionStyle = {
        padding: 'var(--spacing-lg) 0',
        backgroundColor: 'var(--bg-secondary)',
    };

    const stepsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: 'var(--spacing-md)'
    };

    const cardStyle = {
        backgroundColor: 'var(--bg-color)',
        padding: '2rem',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'center',
        transition: 'transform 0.2s ease',
    };

    const stepNumberStyle = {
        display: 'inline-block',
        width: '40px',
        height: '40px',
        lineHeight: '40px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        fontWeight: 'bold',
        marginBottom: '1rem'
    };

    const steps = [
        {
            title: 'Book a Slot',
            desc: 'Choose a time and topic that fits your schedule. Topics range from casual chats to structured debates.'
        },
        {
            title: 'Join the Session',
            desc: 'Connect via video call with a small group of learners and a moderator.'
        },
        {
            title: 'Speak & Listen',
            desc: 'Everyone gets equal speaking time. We ensure the conversation is balanced and inclusive.'
        },
        {
            title: 'Get Feedback',
            desc: 'Receive constructive, actionable feedback from peers and the moderator after every session.'
        }
    ];

    return (
        <section id="how-it-works" style={sectionStyle}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>How It Works</h2>
                <div style={stepsGridStyle}>
                    {steps.map((step, index) => (
                        <div key={index} style={cardStyle} className="step-card">
                            <span style={stepNumberStyle}>{index + 1}</span>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
