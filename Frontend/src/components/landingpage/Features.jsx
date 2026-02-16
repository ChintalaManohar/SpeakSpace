import React from 'react';
import pic from '../../assets/group.png';

const Features = () => {
    const sectionStyle = {
        padding: 'var(--spacing-lg) 0',
        backgroundColor: 'var(--bg-color)',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
    };

    const featureListStyle = {
        listStyle: 'none',
        padding: 0
    };

    const featureItemStyle = {
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        fontSize: '1.1rem',
        color: 'var(--text-secondary)'
    };

    const iconStyle = {
        color: 'var(--primary-color)',
        marginRight: '1rem',
        fontWeight: 'bold',
        fontSize: '1.25rem'
    };

    const features = [
        'Structured group discussions with clear rules',
        'Time-based speaking turns to ensure fairness',
        'Beginner-friendly environment (no judgment)',
        'Peer feedback system to track improvement',
        'Flexible time slots (Morning, Evening, Weekend)'
    ];

    return (
        <section style={sectionStyle}>
            <div className="container">
                <div style={gridStyle}>
                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Designed for Real Progress</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            We've built a system that removes the anxiety of speaking and focuses on consistent improvement.
                        </p>
                        <ul style={featureListStyle}>
                            {features.map((feature, index) => (
                                <li key={index} style={featureItemStyle}>
                                    <span style={iconStyle}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Placeholder for an image or visual representation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <img src={pic} alt="Group discussion" style={{ maxWidth: '100%', height: 'auto', borderRadius: 'var(--border-radius)' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
