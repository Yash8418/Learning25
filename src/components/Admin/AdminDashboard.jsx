import React, { useEffect, useState } from "react";
import Navbar from "../Admin/AdminNavbar"; // Import navbar component
import "../../css/dashboardcss.css";

export const AdminDashboard = () => {
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    fetchTotalProjects();
  }, []);

  const fetchTotalProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/getAllProjects");
      const data = await response.json();
      setTotalProjects(data.length); // Set the project count
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar /> {/* Navbar added here */}

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, Admin</h1>
        </div>

        <div className="cards-container">
          <div className="card">
            <h3>Total Projects</h3>
            <p>{totalProjects}</p> {/* Display total projects */}
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
