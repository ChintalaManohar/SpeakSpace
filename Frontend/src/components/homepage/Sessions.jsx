import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import SessionList from './SessionList';
import './dashboard.css';

const Sessions = () => {
    const [activeTab, setActiveTab] = useState('group'); // 'group' or 'debate'
    // Mock user data - in reality, this would come from context or props
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

    return (
        <div className="dashboard-container">
            <TopNavbar user={user} />

            <div className="dashboard-main">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <main className="content-area sessions-content">
                    {/* Hero section removed as per request */}

                    <h2 className="section-heading">Available Sessions</h2>

                    <SessionList activeTab={activeTab} />
                </main>
            </div>
        </div>
    );
};

export default Sessions;
