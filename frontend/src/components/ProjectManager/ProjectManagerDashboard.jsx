// src/components/ProjectManager/ProjectManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import "../../css/dashboardcss.css";

const ProjectManagerDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    completedTask: 0,
    pendingTasks: 0,
    onGoingTask: 0,
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
        ongoingProjects: projectData.filter((p) => p.status === "running").length,
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
      console.log("tasks: ",data);
      setTasks(data);
      setMetrics((prev) => ({
        ...prev,
        pendingTasks: data.filter((task) => task.status_id.statusName === "pending").length,
        onGoingTask: data.filter((task) => task.status_id.statusName === "running").length,
        completedTask: data.filter((task) => task.status_id.statusName === "completed").length,
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <Navbar role="Project Manager" />
      <div className="dashboard-content">
      <div className="dashboard-header">
          <h1>Welcome back, Project Manager</h1>
        </div>
        {/* <div className="weekly-hours-container">
          <h3>Project Progress Summary</h3> */}
          {/* Placeholder for charts */}
        {/* </div> */}
        {/* <h1>Welcome back, Project Manager</h1> */}
        <div className="cards-container">
          <div className="card">
            <h3>Total Projects</h3>
            <p>{metrics.totalProjects}</p>
          </div>
          {/* <div className="card">
            <h3>Ongoing Projects</h3>
            <p>{metrics.ongoingProjects}</p>
          </div> */}
          <div className="card">
            <h3>Completed Task</h3>
            <p>{metrics.completedTask}</p>
          </div>
          <div className="card">
            <h3>Pending Tasks</h3>
            <p>{metrics.pendingTasks}</p>
          </div>
          <div className="card">
            <h3>Ongoing Tasks</h3>
            <p>{metrics.onGoingTask}</p>
          </div>
          {/* <div className="card">
            <h3>Developer Efficiency</h3>
            <p>{metrics.developerEfficiency}</p>
          </div> */}
        </div>

        {/* Add charts or tables */}
     
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;