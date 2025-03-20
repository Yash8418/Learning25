// src/components/ProjectManager/Developers.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import "../../css/developers.css";

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState([]);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const response = await fetch("http://localhost:8000/getAllUser");
      const data = await response.json();
      const developersData = data.filter((user) => user.role === "Developer");
      setDevelopers(developersData);
    } catch (error) {
      console.error("Error fetching developers:", error);
    }
  };

  const fetchTaskAssignments = async (developerId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/developer/${developerId}`);
      const data = await response.json();
      setTaskAssignments(data);
    } catch (error) {
      console.error("Error fetching task assignments:", error);
    }
  };

  const handleDeveloperSelect = (developer) => {
    setSelectedDeveloper(developer);
    fetchTaskAssignments(developer._id);
  };

  return (
    <div>
      <Navbar role="Project Manager" />
      <div className="developers-container">
        <h1>Developers</h1>
        <div className="developers-list">
          {developers.map((developer) => (
            <div
              key={developer._id}
              className={`developer-card ${selectedDeveloper?._id === developer._id ? "selected" : ""}`}
              onClick={() => handleDeveloperSelect(developer)}
            >
              <h2>{developer.username}</h2>
              <p>Email: {developer.email}</p>
              <p>Current Project: {developer.currentProject || "Not Assigned"}</p>
            </div>
          ))}
        </div>

        {selectedDeveloper && (
          <div className="developer-details">
            <h2>{selectedDeveloper.username}'s Tasks</h2>
            {taskAssignments.map((task) => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Developers;
