import React, { useEffect, useState } from "react";
import "../../css/project.css";
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem("id");
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/getAllProjects`);
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="project-page-container">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">Manage and track all your ongoing projects</p>

        <div className="project-actions">
          <input type="text" placeholder="Search projects..." className="search-box" />
          <button className="new-project-btn" onClick={() => navigate("/ProjectManager/addProject")}>
            + New Project
          </button>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : projects.length > 0 ? (
          <div className="project-list">
            {projects.map((project) => (
              <div className="project-card" key={project._id}>
                <h3>{project.title}</h3>
                <p><strong>Description:</strong> {project.description}</p>
                <p><strong>Technology:</strong> {project.technology}</p>
                <p><strong>Estimated Hours:</strong> {project.estimatedHours} hours</p>
                <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                <p><strong>Completion Date:</strong> {new Date(project.completionDate).toLocaleDateString()}</p>
                
                {/* ✅ FIXED: Now using project.developers directly */}
                
                <p><strong>Assigned Developers:</strong></p>
                  <ul>
                    {project.dev_id && project.dev_id.length > 0 ? (
                      project.dev_id.map((dev) => (
                        <li key={dev._id}>{dev.username || "Unknown Developer"}</li>
                      ))
                    ) : (
                      <li>No developers assigned</li>
                    )}
                  </ul>


              </div>
            ))}
          </div>
        ) : (
          <p className="no-projects">No projects available</p>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
