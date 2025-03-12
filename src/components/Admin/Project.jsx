import React, { useEffect, useState } from "react";
import "../../css/project.css";
import Navbar from "../common/Navbar";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ title, description, estimatedHours, technology, completionDate }) => {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="project-info">
        <span> {estimatedHours} hours</span>
        <span> {technology} </span>
        <span> {completionDate} </span>
      </div>
    </div>
  );
};

const ProjectPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/getAllProjects"); // Update URL if needed
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
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
          <button className="new-project-btn" onClick={() => navigate("/admin/addProject")}>
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
              <ProjectCard key={project.id} {...project} />
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
