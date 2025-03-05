import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/dashboardcss.css'; // Import CSS

export const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/addProject" className="nav-link">Projects</Link>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h3>Welcome to the Admin Dashboard</h3>
      </div>
    </div>
  );
};
