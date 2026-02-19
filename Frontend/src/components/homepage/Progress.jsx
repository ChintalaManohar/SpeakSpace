import React from 'react';
import TopNavbar from './TopNavbar';
import api from '../../api/axios';
import './dashboard.css';

const Progress = () => {
    const user = JSON.parse(sessionStorage.getItem('user')) || { name: 'Guest' };
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/feedback/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const renderStars = (score) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(<span key={i} className={`star ${i <= Math.round(score) ? 'filled' : ''}`}>★</span>);
        }
        return stars;
    };

    if (loading) return <div className="dashboard-container"><div className="loading">Loading stats...</div></div>;
    if (error) return <div className="dashboard-container"><div className="error">{error}</div></div>;

    return (
        <div className="dashboard-container">
            <TopNavbar user={user} />

            <div className="dashboard-main">
                <main className="content-area progress-content">
                    <div className="progress-container">
                        <h1 className="page-title">Your Growth Journey</h1>
                        <p className="page-subtitle">Reflect on your achievements and keep moving forward.</p>

                        {/* 1. Progress Overview Section */}
                        <section className="progress-section">
                            <div className="progress-card overview-card">
                                <h2 className="card-heading">Progress Overview</h2>
                                <div className="overview-stats">
                                    <div className="overview-item">
                                        <span className="overview-value">{stats?.sessionsAttended || 0}</span>
                                        <span className="overview-label">Sessions Attended</span>
                                    </div>
                                    <div className="stat-divider-vertical"></div>
                                    <div className="overview-item">
                                        <span className="overview-value">{stats?.averageScores?.overall || 0} <span className="star">⭐</span></span>
                                        <span className="overview-label">Avg. Feedback Score</span>
                                    </div>
                                </div>
                                <div className="improvement-summary">
                                    <strong>Summary:</strong> You have received {stats?.totalFeedbackReceived || 0} feedback submissions.
                                </div>
                            </div>
                        </section>

                        {/* 2. Sessions Attended List */}
                        <section className="progress-section">
                            <div className="progress-card">
                                <h2 className="card-heading">Sessions Attended</h2>
                                {stats?.attendedSessionsList?.length > 0 ? (
                                    <div className="attended-sessions-list">
                                        {stats.attendedSessionsList.map(session => (
                                            <div key={session._id} className="attended-session-item">
                                                <div className="session-info">
                                                    <span className="session-topic">{session.topic}</span>
                                                    <span className="session-date">{new Date(session.startTime).toLocaleDateString()}</span>
                                                </div>
                                                <span className="session-duration">{session.duration} min</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-feedback">No sessions attended yet.</p>
                                )}
                            </div>
                        </section>

                        {/* 2. Feedback Summary Section */}
                        <section className="progress-section">
                            <div className="progress-card feedback-card">
                                <h2 className="card-heading">Feedback Summary</h2>
                                <div className="feedback-metrics">
                                    <div className="feedback-metric">
                                        <span className="metric-label">Confidence</span>
                                        <div className="star-rating">{renderStars(stats?.averageScores?.confidence || 0)}</div>
                                        <span className="score-value">({stats?.averageScores?.confidence || 0})</span>
                                    </div>
                                    <div className="feedback-metric">
                                        <span className="metric-label">Clarity</span>
                                        <div className="star-rating">{renderStars(stats?.averageScores?.clarity || 0)}</div>
                                        <span className="score-value">({stats?.averageScores?.clarity || 0})</span>
                                    </div>
                                    <div className="feedback-metric">
                                        <span className="metric-label">Listening</span>
                                        <div className="star-rating">{renderStars(stats?.averageScores?.listening || 0)}</div>
                                        <span className="score-value">({stats?.averageScores?.listening || 0})</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Recent Feedback List */}
                        <section className="progress-section">
                            <div className="progress-card recent-feedback-card">
                                <h2 className="card-heading">Recent Feedback</h2>
                                {stats?.recentFeedback?.length > 0 ? (
                                    <div className="recent-feedback-list">
                                        {stats.recentFeedback.map(item => (
                                            <div key={item.id} className="feedback-item">
                                                <div className="feedback-item-header">
                                                    <span className="session-topic">{item.sessionTopic}</span>
                                                    <span className="feedback-date">{new Date(item.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="feedback-scores-mini">
                                                    <span>Conf: {item.confidence}</span>
                                                    <span>Clar: {item.clarity}</span>
                                                    <span>List: {item.listening}</span>
                                                </div>
                                                {item.comment && <p className="feedback-comment">"{item.comment}"</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-feedback">No feedback received yet.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Progress;
