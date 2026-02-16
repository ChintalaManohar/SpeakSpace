import React from 'react';

// Inline SVG Icons
const Users = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const Zap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

const MessageCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const BookOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const sessions = [
    {
        icon: Users,
        title: "Group Discussions",
        description: "Structured conversations on trending topics with 4-6 participants.",
        level: "All Levels",
    },
    {
        icon: Zap,
        title: "Debates",
        description: "Practice making arguments, defending positions, and thinking on your feet.",
        level: "Intermediate",
    },
    {
        icon: MessageCircle,
        title: "Open Speaking Sessions",
        description: "Free-form practice sessions to build comfort with spontaneous speaking.",
        level: "Beginner",
    },
    {
        icon: BookOpen,
        title: "Topic-Based Conversations",
        description: "Deep dives into specific subjects—from current events to abstract ideas.",
        level: "All Levels",
    },
];

const Sessions = () => {
    return (
        <section id="sessions" className="sessions">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Sample Sessions & Activities
                    </h2>
                    <p className="section-subtitle">
                        Choose from a variety of session types designed for different goals and skill levels.
                    </p>
                </div>

                <div className="sessions-grid">
                    {sessions.map((session) => (
                        <div key={session.title} className="session-card">
                            <div className="session-header">
                                <div className="session-icon">
                                    <session.icon />
                                </div>
                                <span className="badge">{session.level}</span>
                            </div>
                            <h3 className="session-title">
                                {session.title}
                            </h3>
                            <p className="session-description">
                                {session.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Sessions;
