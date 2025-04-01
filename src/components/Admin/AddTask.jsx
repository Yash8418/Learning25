import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./AdminNavbar";

const AddTask = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    priority: "",
    description: "",
    totalMinutes: "",
    projectId: "",
    moduleId: "",
    statusId: "67eb8d26088dd81c6481659f", // Default to "To do"
  });

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const priorities = ["Low", "Medium", "High"];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getAllProjects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchModules = async (projectId) => {
    if (!projectId) {
      setModules([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/getProjectModule?projectId=${projectId}`);
      const filteredModules = response.data.filter(module => module.projectId === projectId);
      setModules(filteredModules);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "projectId") {
      setModules([]); // Clear previous modules
      fetchModules(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.description || !taskData.projectId || !taskData.priority) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/addTask", taskData);
      alert("Task added successfully!");
      // navigate("/admin/getTask");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Add Task</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={taskData.title}
            onChange={handleChange}
            required
          />

          {/* Priority Dropdown */}
          <select name="priority" value={taskData.priority} onChange={handleChange} required>
            <option value="">Select Priority</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Task Description"
            value={taskData.description}
            onChange={handleChange}
            required
          />
          
          <input
            type="number"
            name="totalMinutes"
            placeholder="Total Minutes"
            value={taskData.totalMinutes}
            onChange={handleChange}
          />

          {/* Project Selection */}
          <select name="projectId" value={taskData.projectId} onChange={handleChange} required>
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>{project.title}</option>
            ))}
          </select>

          {/* Module Selection (updates dynamically) */}
          <select name="moduleId" value={taskData.moduleId} onChange={handleChange}>
            <option value="">Select Module</option>
            {modules.map((module) => (
              <option key={module._id} value={module._id}>{module.moduleName}</option>
            ))}
          </select>

          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
