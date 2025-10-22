// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing pages
import Register from './pages/Register';
import Login from './pages/Login';
import BorrowerDashboard from './pages/BorrowerDashboard';
import LenderDashboard from './pages/LenderDashboard';
import PublisherDashboard from './pages/PublisherDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Newly added public pages
import PublicHome from './pages/PublicHome';
import PublicBlogs from './pages/PublicBlogs';
import BlogDetail from './pages/BlogDetail';
import PublicEquipment from './pages/PublicEquipment';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/blogs" element={<PublicBlogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/equipment" element={<PublicEquipment />} />

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/borrower-dashboard" element={<BorrowerDashboard />} />
        <Route path="/lender-dashboard" element={<LenderDashboard />} />
        <Route path="/publisher-dashboard" element={<PublisherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
