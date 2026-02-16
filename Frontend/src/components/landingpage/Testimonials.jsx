import React from 'react';

const Testimonials = () => {
    const sectionStyle = {
        padding: 'var(--spacing-lg) 0',
        backgroundColor: 'var(--bg-color)',
        textAlign: 'center'
    };

    const quoteStyle = {
        fontSize: '1.5rem',
        fontStyle: 'italic',
        color: 'var(--text-secondary)',
        maxWidth: '800px',
        margin: '0 auto var(--spacing-sm)',
        lineHeight: '1.6'
    };

    const authorStyle = {
        fontWeight: 'bold',
        color: 'var(--text-primary)'
    };

    return (
        <section style={sectionStyle}>
            <div className="container">
                <blockquote style={quoteStyle}>
                    "I used to freeze up in meetings. After practicing on SpeakSpace for a month, I actually volunteered to lead a presentation. The supportive environment changed everything."
                </blockquote>
                <div style={authorStyle}>— Sarah J., Product Manager</div>
            </div>
        </section>
    );
};

export default Testimonials;
