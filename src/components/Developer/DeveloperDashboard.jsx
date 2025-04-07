// src/components/Developer/DeveloperDashboard.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../Developer/DeveloperNavbar";
import "../../css/dashboardcss.css";

const DeveloperDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalAssignedTasks: 0,
    pendingTasks: 0,
    runningTasks: 0,
    completedTasks: 0,
    hoursLoggedThisWeek: "40", // Placeholder
    overdueTasks: 0,
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchMetrics();
    fetchTasks();
  }, []);

  const fetchMetrics = async () => {
    try {
      const developerId = localStorage.getItem("id");
      const response = await fetch(`http://localhost:8000/getAllTasksByDeveloperId/${developerId}`);
      const taskData = await response.json();

      setMetrics((prev) => ({
        ...prev,
        totalAssignedTasks: taskData.length,
        pendingTasks: taskData.filter((t) => t.status_id?.statusName === "pending").length,
        runningTasks: taskData.filter((t) => t.status_id?.statusName === "running").length,
        completedTasks: taskData.filter((t) => t.status_id?.statusName === "completed").length,
        overdueTasks: taskData.filter((t) => t.status_id?.statusName === "overdue").length, // optional
      }));
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const developerId = localStorage.getItem("id");
      const response = await fetch(`http://localhost:8000/getAllTasksByDeveloperId/${developerId}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <Navbar role="Developer" />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, Developer</h1>
        </div>

        <div className="cards-container">
          <div className="card">
            <h3>Total Assigned Tasks</h3>
            <p>{metrics.totalAssignedTasks}</p>
          </div>
          <div className="card">
            <h3>Pending Tasks</h3>
            <p>{metrics.pendingTasks}</p>
          </div>
          <div className="card">
            <h3>Running Tasks</h3>
            <p>{metrics.runningTasks}</p>
          </div>
          <div className="card">
            <h3>Completed Tasks</h3>
            <p>{metrics.completedTasks}</p>
          </div>
          <div className="card">
            <h3>Hours Logged This Week</h3>
            <p>{metrics.hoursLoggedThisWeek}</p>
          </div>
          <div className="card">
            <h3>Overdue Tasks</h3>
            <p>{metrics.overdueTasks}</p>
          </div>
        </div>

        <div className="weekly-hours-container">
          {/* Placeholder for charts */}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
