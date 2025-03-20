// src/components/ProjectManager/ProjectManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import "../../css/dashboardcss.css";

const ProjectManagerDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    developerEfficiency: "85%", // Placeholder value
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchMetrics();
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("http://localhost:8000/getAllProjects");
      const projectData = await response.json();
      setMetrics((prev) => ({
        ...prev,
        totalProjects: projectData.length,
        ongoingProjects: projectData.filter((p) => p.status === "ongoing").length,
        completedProjects: projectData.filter((p) => p.status === "completed").length,
      }));
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/getAllProjects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/getTask");
      const data = await response.json();
      setTasks(data);
      setMetrics((prev) => ({
        ...prev,
        pendingTasks: data.filter((task) => task.status === "pending").length,
        overdueTasks: data.filter((task) => task.status === "overdue").length,
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <Navbar role="Project Manager" />
      <div className="dashboard-content">
        <h1>Welcome back, Project Manager</h1>
        <div className="cards-container">
          <div className="card">
            <h3>Total Projects</h3>
            <p>{metrics.totalProjects}</p>
          </div>
          <div className="card">
            <h3>Ongoing Projects</h3>
            <p>{metrics.ongoingProjects}</p>
          </div>
          <div className="card">
            <h3>Completed Projects</h3>
            <p>{metrics.completedProjects}</p>
          </div>
          <div className="card">
            <h3>Pending Tasks</h3>
            <p>{metrics.pendingTasks}</p>
          </div>
          <div className="card">
            <h3>Overdue Tasks</h3>
            <p>{metrics.overdueTasks}</p>
          </div>
          <div className="card">
            <h3>Developer Efficiency</h3>
            <p>{metrics.developerEfficiency}</p>
          </div>
        </div>

        {/* Add charts or tables */}
        <div className="weekly-hours-container">
          <h3>Project Progress Summary</h3>
          {/* Placeholder for charts */}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
