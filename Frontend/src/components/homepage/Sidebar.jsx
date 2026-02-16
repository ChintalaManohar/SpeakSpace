import React from 'react';
import './dashboard.css';

const Sidebar = ({ activeTab, setActiveTab, title = 'Sessions' }) => {
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">{title}</div>

            <div
                className={`sidebar-item ${activeTab === 'group' ? 'active' : ''}`}
                onClick={() => setActiveTab('group')}
            >
                <span style={{ fontSize: '1.2rem' }}>👥</span>
                Group Discussion
            </div>

            <div
                className={`sidebar-item ${activeTab === 'debate' ? 'active' : ''}`}
                onClick={() => setActiveTab('debate')}
            >
                <span style={{ fontSize: '1.2rem' }}>⚖️</span>
                Debate
            </div>
        </aside>
    );
};

export default Sidebar;
