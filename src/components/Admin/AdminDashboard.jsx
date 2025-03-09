import React from "react";
import Navbar from "../common/Navbar"; // Import navbar component
import "../../css/dashboardcss.css";

export const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Navbar /> {/* Navbar added here */}

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, admin</h1>
        </div>

        <div className="cards-container">
          <div className="card">
            <h3>Total Projects</h3>
            <p>0</p>
          </div>
          <div className="card">
            <h3>Active Tasks</h3>
            <p>0</p>
          </div>
          <div className="card">
            <h3>Hours This Week</h3>
            <p>0</p>
          </div>
        </div>

        <div className="weekly-hours-container">
          <h3>Weekly Hours</h3>
          <div className="weekly-chart">[Graph Placeholder]</div>
        </div>

        
      </div>
    </div>
  );
};
