import React, { useState, useEffect } from "react";
import "../../css/module.css";
import Navbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";

const AddModule = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [formData, setFormData] = useState({
    projectId: "",
    moduleName: "",
    description: "",
    estimatedHours: "",
    startDate: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/getAllProjects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // When project is selected, update developers list
    if (name === "projectId") {
      const selectedProject = projects.find((project) => project._id === value);
      setDevelopers(selectedProject?.dev_id || []); // Use dev_id array if available
    }
  };

  const handleDeveloperSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedDevelopers(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", { ...formData, assignedDevelopers: selectedDevelopers });
    try {
      const response = await fetch("http://localhost:8000/addProjectModule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, assignedDevelopers: selectedDevelopers }),
      });
      if (!response.ok) throw new Error("Failed to add module");
      alert("Module added successfully!");
      navigate("/admin/addModule");
    } catch (err) {
      console.error("Error adding module:", err);
      alert("Failed to add module. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h1 className="page-title">Add Project Module</h1>

        <form onSubmit={handleSubmit}>
          <label>Select Project:</label>
          <select name="projectId" value={formData.projectId} onChange={handleChange} required>
            <option value="">-- Select a Project --</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>

          <div className="form-group">
            <label>Assign Developers</label>
            <select multiple onChange={handleDeveloperSelect} className="developer-select">
              {developers.map(dev => (
                <option key={dev._id} value={dev._id}>{dev.username}</option>
              ))}
            </select>
          </div>

          <label>Module Name:</label>
          <input type="text" name="moduleName" value={formData.moduleName} onChange={handleChange} required />

          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />

          <label>Estimated Hours:</label>
          <input type="number" name="estimatedHours" value={formData.estimatedHours} onChange={handleChange} required />

          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

          <button type="submit">Add Module</button>
        </form>
      </div>
    </div>
  );
};

export default AddModule;
