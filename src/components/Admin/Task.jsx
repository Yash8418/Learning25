import React, { useState, useEffect } from "react";
import Navbar from "./AdminNavbar";
import "../../css/tasks.css";
import TaskManager from "./TaskManager"; 

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // Fetch tasks
  useEffect(() => {
    fetch("http://localhost:8000/getTask") // API endpoint
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Fetch projects
  useEffect(() => {
    fetch("http://localhost:8000/getAllProjects")
      .then((response) => response.json())
      .then((data) => {
        console.log("Full API Response:", data); // Debugging
        setProjects(data); // Directly setting data since it's an array
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);
  

  return (
    <div>
      <Navbar />
      <div className="tasks-container">
        <h1>Tasks</h1>

        {/* Project Dropdown */}
        <label>Select Project:</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map((project) => (
    <option key={project.id} value={project.id}>
      {project.title}  {/* Change 'name' to 'title' */}
    </option>
  ))}
        </select>

        <TaskManager />
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-details">
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p className="estimated-time">
                  ⏳ {task.totalMinutes} minutes estimated
                </p>
              </div>
              <div className="task-actions">
                {task.status_id && (
                  <span className={`status ${task.status_id.name}`}>
                    {task.status_id.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;