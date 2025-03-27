import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import AdminNavbar from "./AdminNavbar";
import Navbar from "./AdminNavbar";
import "../../css/task.css"

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // Fetch tasks and projects
  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getTask");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getAllProjects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="task-container">
        <h1>Tasks</h1>

        {/* Project Dropdown Filter */}
        <label>Select Project:</label>
        <select onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>

        {/* Add Task Button */}
        <Link to="/admin/addTask">
          <button className="add-task-btn">Add Task</button>
        </Link>

        {/* Task List */}
        <div className="task-list">
          {tasks
            .filter((task) => !selectedProject || task.projectId === selectedProject)
            .map((task) => (
              <div key={task._id} className="task-card">
                <h2>{task.title}</h2>
                <p style={{padding:"3px 0px"}} >{task.description}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Total Minutes:</strong> {task.totalMinutes}</p>
                <p><strong>Status:</strong> {task.status_id.statusName}</p>
                <p><strong>Project:</strong> {task.project_id.title}</p>
                <p><strong>Module:</strong> {task.module_id.moduleName}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;