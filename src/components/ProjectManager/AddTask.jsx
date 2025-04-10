import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./ProjectManagerNavbar";
import "../../css/addTask.css";

const AddTask_pm = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    priority: "",
    description: "",
    totalMinutes: "",
    projectId: "",
    moduleId: "",
    assignedDevelopers: [],
    statusId: "67eb8d26088dd81c6481659f", // Default "To Do"
  });

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
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

  useEffect(() => {
    if (taskData.projectId) {
      fetchModules(taskData.projectId);
    }
  }, [taskData.projectId, projects]);

  const fetchModules = async (projectId) => {
    if (!projectId) {
      setModules([]);
      setDevelopers([]);
      setFilteredDevelopers([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/getProjectModule?projectId=${projectId}`);
      const filteredModules = response.data.filter((module) => module.projectId === projectId);
      setModules(filteredModules);

      const project = projects.find((p) => p._id === projectId);
      setDevelopers(project?.dev_id || []);
    } catch (error) {
      console.error("Error fetching modules:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (taskData.moduleId) {
      filterDevelopersByModule(taskData.moduleId);
    }
  }, [taskData.moduleId, modules]);

  const filterDevelopersByModule = (moduleId) => {
    if (!moduleId) {
      setFilteredDevelopers([]);
      return;
    }

    const selectedModule = modules.find((mod) => mod._id === moduleId);
    setFilteredDevelopers(selectedModule?.dev_id || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "projectId") {
      setModules([]);
      setFilteredDevelopers([]);
      setSelectedDevelopers([]);
      fetchModules(value);
    }

    if (name === "moduleId") {
      setFilteredDevelopers([]);
      setSelectedDevelopers([]);
      filterDevelopersByModule(value);
    }
  };

  const handleDeveloperSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedDevelopers(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.description || !taskData.projectId || !taskData.priority) {
      alert("Please fill in all required fields!");
      return;
    }

    const finalTaskData = { ...taskData, assignedDevelopers: selectedDevelopers };

    try {
      await axios.post("http://localhost:8000/addTask", finalTaskData);
      alert("Task added successfully!");
      // navigate("/pm/getTask");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-task-form">
        <h2 className="page-title">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              placeholder="Task Title"
              required
            />
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select name="priority" value={taskData.priority} onChange={handleChange} required>
              <option value="">Select Priority</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              placeholder="Task Description"
              required
            />
          </div>

          <div className="form-group">
            <label>Total Minutes:</label>
            <input
              type="number"
              name="totalMinutes"
              value={taskData.totalMinutes}
              onChange={handleChange}
              placeholder="Total Minutes"
            />
          </div>

          <div className="form-group">
            <label>Project:</label>
            <select name="projectId" value={taskData.projectId} onChange={handleChange} required>
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Module:</label>
            <select name="moduleId" value={taskData.moduleId} onChange={handleChange} required>
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>{module.moduleName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Assign Developers:</label>
            <select
              multiple
              className="developer-select"
              onChange={handleDeveloperSelect}
              value={selectedDevelopers}
            >
              {filteredDevelopers.length === 0 ? (
                <option value="">No Developers Available</option>
              ) : (
                filteredDevelopers.map((dev) => (
                  <option key={dev._id} value={dev._id}>
                    {dev.username}
                  </option>
                ))
              )}
            </select>
          </div>

          <button type="submit">Add Task</button>
        </form>
      </div>
    </>
  );
};

export default AddTask_pm;
