import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/landingpage/Header';
import LandingPage from './components/landingpage/LandingPage';
import Footer from './components/landingpage/Footer';
import Login from './components/login/Login';
import CreateAccount from './components/createaccount/CreateAccount';

import DashboardHome from './components/homepage/DashboardHome';
import Sessions from './components/homepage/Sessions';
import MySessions from './components/homepage/MySessions';
import Progress from './components/homepage/Progress';
import Profile from './components/profilepage/Profile';
import Settings from './components/settings/Settings';
import VideoRoom from './components/video/VideoRoom';



import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSessions from './components/admin/AdminSessions';
import AdminUsers from './components/admin/AdminUsers';

import VerifyEmail from './components/verifyemail/VerifyEmail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <LandingPage />
              <Footer />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/session/:sessionId" element={<VideoRoom />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
