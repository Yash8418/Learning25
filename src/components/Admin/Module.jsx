import React, { useState, useEffect } from "react";
import axios from "axios";

const Module = () => {
    const [projects, setProjects] = useState([]);  // Store projects from DB
    const [selectedProject, setSelectedProject] = useState("");  // Store Project ID
    const [moduleName, setModuleName] = useState("");
    const [description, setDescription] = useState("");
    const [estimatedHours, setEstimatedHours] = useState("");
    const [status, setStatus] = useState("running");  // Default status
    const [startDate, setStartDate] = useState("");

    // ✅ Fetch projects from backend
    useEffect(() => {
        axios.get("http://localhost:8000/getAllProjects")
            .then((response) => {
                console.log("Projects:", response.data); // Debugging
                setProjects(response.data);  
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
            });
    }, []);

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProject) {
            alert("Please select a project!");
            return;
        }

        const moduleData = {
            projectId: selectedProject,  // Ensure correct project ID is sent
            moduleName,
            description,
            estimatedHours: parseInt(estimatedHours),  // Ensure number format
            status,
            startDate,
        };

        try {
            await axios.post("http://localhost:8000/addProjectModule", moduleData);
            alert("Module Added Successfully!");
        } catch (error) {
            console.error("Error adding module:", error);
            alert("Failed to add module!");
        }
    };

    return (
        <div className="container">
            <h2>Add Project Module</h2>
            <form onSubmit={handleSubmit}>
                {/* ✅ Project Dropdown - Store ID, Display Name */}
                <label>Select Project:</label>
                <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    required
                >
                    <option value="">-- Select a Project --</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project._id}>
                            {project.title} {/* Show name, store ID */}
                        </option>
                    ))}
                </select>

                {/* ✅ Module Name */}
                <label>Module Name:</label>
                <input type="text" value={moduleName} onChange={(e) => setModuleName(e.target.value)} required />

                {/* ✅ Description */}
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                {/* ✅ Estimated Hours */}
                <label>Estimated Hours:</label>
                <input type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} required />

                {/* ✅ Status */}
                <label>Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>

                {/* ✅ Start Date */}
                <label>Start Date:</label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

                {/* ✅ Submit Button */}
                <button type="submit">Add Module</button>
            </form>
        </div>
    );
};

export default Module;
