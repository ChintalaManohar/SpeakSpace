import React from 'react';

const ProblemStatement = () => {
    const sectionStyle = {
        padding: 'var(--spacing-lg) 0',
        backgroundColor: 'var(--bg-color)',
        textAlign: 'center'
    };

    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 var(--spacing-sm)'
    };

    const headerStyle = {
        maxWidth: '800px',
        margin: '0 auto var(--spacing-lg)'
    };

    const titleStyle = {
        fontSize: '2.5rem',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--text-primary)',
        fontWeight: '700'
    };

    const descriptionStyle = {
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.6'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-lg)'
    };

    const cardStyle = {
        backgroundColor: 'white',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1px solid var(--bg-secondary)'
    };

    const iconContainerStyle = (bgColor, color) => ({
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: bgColor,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-sm)',
        fontSize: '24px'
    });

    const cardTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-xs)'
    };

    const cardTextStyle = {
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        lineHeight: '1.5'
    };

    const features = [
        {
            title: "Fear of Judgment",
            description: "Worried about what others think when you speak up",
            iconBg: "#FEF2F2", // Red 50
            iconColor: "#EF4444", // Red 500
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            )
        },
        {
            title: "Lack of Practice",
            description: "No regular opportunities to practice speaking skills",
            iconBg: "#FFF7ED", // Orange 50
            iconColor: "#F97316", // Orange 500
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            )
        },
        {
            title: "No Feedback Loop",
            description: "Never knowing what to improve or how you're doing",
            iconBg: "#ECFDF5", // Emerald 50
            iconColor: "#10B981", // Emerald 500
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            )
        }
    ];

    return (
        <section  style={sectionStyle}>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>Why communication feels hard</h2>
                    <p style={descriptionStyle}>
                        You don't struggle with speaking because you lack ideas. You struggle because you've never had
                        a safe space to practice. Most learning happens in high-stakes situations—interviews, meetings,
                        presentations—where mistakes feel costly.
                    </p>
                </div>

                <div style={gridStyle}>
                    {features.map((feature, index) => (
                        <div key={index} style={cardStyle}>
                            <div style={iconContainerStyle(feature.iconBg, feature.iconColor)}>
                                {feature.icon}
                            </div>
                            <h3 style={cardTitleStyle}>{feature.title}</h3>
                            <p style={cardTextStyle}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemStatement;
