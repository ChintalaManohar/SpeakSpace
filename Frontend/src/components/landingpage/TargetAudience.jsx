import React from 'react';

const TargetAudience = () => {
    const sectionStyle = {
        padding: 'var(--spacing-lg) 0',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        textAlign: 'center'
    };

    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 var(--spacing-sm)'
    };

    const gridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
        marginTop: 'var(--spacing-md)'
    };

    const tagStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '0.75rem 1.5rem',
        borderRadius: '50px',
        fontSize: '1.1rem',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    const audienceList = [
        'Students preparing for GDs',
        'Job Seekers & Interviewees',
        'Introverts',
        'Non-native English Speakers',
        'Professionals',
        'Aspiring Leaders'
    ];

    return (
        <section id="about" style={sectionStyle}>
            <div style={containerStyle}>
                <h2 style={{ color: 'white' }}>Who Is SpeakSpace For?</h2>
                <div style={gridStyle}>
                    {audienceList.map((item, index) => (
                        <div key={index} style={tagStyle}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;
