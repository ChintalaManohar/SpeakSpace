import React from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import pic from '../../assets/people.png';
import { Mic, Calendar, TrendingUp, UserPen, Lightbulb, Map } from 'lucide-react';
import './dashboard.css';

const DashboardHome = () => {
    // Mock user data
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
    const firstName = (user?.name || 'User').split(' ')[0];

    // State for stats
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/feedback/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            <TopNavbar user={user} />

            <div className="dashboard-main">
                <main className="content-area">
                    {/* 1. Hero Section */}
                    <div className="dashboard-hero" style={{ backgroundImage: `url(${pic})` }}>
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <h1 className="greeting-title">
                                Welcome back, {firstName} <span className="wave-emoji">👋</span>
                            </h1>
                            <p className="greeting-subtitle">This is your space to practice and build confidence.</p>
                        </div>
                    </div>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 5rem' }}>
                        {/* 2. Today at a Glance + Progress Snapshot */}
                        <section className="info-cards-section">
                            {/* Today at a Glance */}
                            <div className="info-card today-card">
                                <div className="card-header">
                                    <h3>Today at a Glance</h3>
                                    <span className="status-badge">No Sessions</span>
                                </div>
                                <div className="card-body">
                                    <p className="empty-state-text">You have no upcoming sessions scheduled for today.</p>
                                    <p className="sub-text">Consistency is key! Why not browse available sessions?</p>
                                </div>
                                <div className="card-footer">
                                    <Link to="/sessions" className="btn-primary-soft">Explore Sessions</Link>
                                </div>
                            </div>

                            {/* Progress Snapshot */}
                            <div className="info-card progress-card">
                                <div className="card-header">
                                    <h3>Progress Snapshot</h3>
                                </div>
                                <div className="card-body">
                                    {loading ? (
                                        <div style={{ color: '#888' }}>Loading stats...</div>
                                    ) : (
                                        <>
                                            <div className="progress-stats">
                                                <div className="stat-item">
                                                    <span className="stat-value">{stats?.sessionsAttended || 0}</span>
                                                    <span className="stat-label">Sessions Attended</span>
                                                </div>
                                                <div className="stat-divider"></div>
                                                <div className="stat-item">
                                                    <span className="stat-value">{stats?.averageScores?.overall || 0}</span>
                                                    <span className="stat-label">Avg. Feedback</span>
                                                </div>
                                            </div>
                                            <div className="confidence-trend">
                                                <span className="trend-icon up">↗</span>
                                                <span className="trend-text">Keep joining sessions to see your growth!</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 3. Quick Actions */}
                        <section className="quick-actions-section">
                            <h2 className="section-title">Quick Actions</h2>
                            <div className="actions-grid">
                                <Link to="/sessions" className="action-card">
                                    <div className="action-icon">
                                        <Mic size={28} color="#4f46e5" />
                                    </div>
                                    <span>Explore Sessions</span>
                                </Link>
                                <Link to="/my-sessions" className="action-card">
                                    <div className="action-icon">
                                        <Calendar size={28} color="#3b82f6" />
                                    </div>
                                    <span>My Sessions</span>
                                </Link>
                                <Link to="/progress" className="action-card">
                                    <div className="action-icon">
                                        <TrendingUp size={28} color="#059669" />
                                    </div>
                                    <span>View Progress</span>
                                </Link>
                                <Link to="/profile" className="action-card">
                                    <div className="action-icon">
                                        <UserPen size={28} color="#7c3aed" />
                                    </div>
                                    <span>Edit Profile</span>
                                </Link>
                            </div>
                        </section>

                        {/* 4. Suggestions / Tip Section */}
                        <section className="suggestions-section">
                            <div className="suggestion-box">
                                <div className="suggestion-icon">
                                    <Lightbulb size={24} color="#db2777" />
                                </div>
                                <div className="suggestion-content">
                                    <h4>Suggestions for you</h4>
                                    <ul>
                                        <li>Try a beginner debate this week to step out of your comfort zone.</li>
                                        <li>Practice twice to build confidence and refine your speaking skills.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardHome;
