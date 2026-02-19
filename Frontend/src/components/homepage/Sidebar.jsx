import React from 'react';
import { Users, MessageSquareText } from 'lucide-react';
import './dashboard.css';

const Sidebar = ({ activeTab, setActiveTab, title = 'Sessions' }) => {
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">{title}</div>

            <div
                className={`sidebar-item ${activeTab === 'group' ? 'active' : ''}`}
                onClick={() => setActiveTab('group')}
            >
                <Users size={20} />
                Group Discussion
            </div>

            <div
                className={`sidebar-item ${activeTab === 'debate' ? 'active' : ''}`}
                onClick={() => setActiveTab('debate')}
            >
                <MessageSquareText size={20} />
                Debate
            </div>
        </aside>
    );
};

export default Sidebar;
