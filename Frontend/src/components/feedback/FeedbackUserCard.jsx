import React from 'react';
import './Feedback.css';

const FeedbackUserCard = ({ user, feedback, onChange, isOpen, onToggle }) => {
    const { id, name } = user;
    const { confidence, clarity, listening, comment } = feedback || { confidence: 0, clarity: 0, listening: 0, comment: '' };

    const renderStars = (category, value) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= value ? 'filled' : ''}`}
                        onClick={() => onChange(id, category, star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className={`feedback-user-card ${isOpen ? 'open' : ''}`}>
            <div className="feedback-header" onClick={onToggle}>
                <span className="user-name">{name}</span>
                <span className="toggle-icon">{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className="feedback-body">
                    <div className="rating-row">
                        <label>Confidence</label>
                        {renderStars('confidence', confidence)}
                    </div>
                    <div className="rating-row">
                        <label>Clarity</label>
                        {renderStars('clarity', clarity)}
                    </div>
                    <div className="rating-row">
                        <label>Listening</label>
                        {renderStars('listening', listening)}
                    </div>

                    <div className="comment-section">
                        <label>Optional Comment:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => onChange(id, 'comment', e.target.value)}
                            placeholder={`Feedback for ${name}...`}
                            rows="2"
                        />
                    </div>
                </div>
            )}

            {/* Summary status when closed */}
            {!isOpen && (
                <div className="feedback-summary">
                    {confidence > 0 && clarity > 0 && listening > 0 ? (
                        <span className="status-complete">✓ Rated</span>
                    ) : (
                        <span className="status-pending">Pending</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackUserCard;
