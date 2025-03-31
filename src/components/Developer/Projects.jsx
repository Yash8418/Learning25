import React, { useEffect, useState } from "react";
import "../../css/project.css";
import Navbar from "../Developer/DeveloperNavbar";
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

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/getAllProjects/");
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();

        // Get developer ID from localStorage (assumed it's stored when logged in)
        const developerId = localStorage.getItem("id");

        // Filter projects assigned to this developer
        const assignedProjects = data.filter(project => 
          project.assignedDevelopers.includes(developerId)
        );

        setProjects(assignedProjects);
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
      <Navbar role="Developer" />
      <div className="project-page-container">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">Manage and track your assigned projects</p>

        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : projects.length > 0 ? (
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard key={project._id} {...project} />
            ))}
          </div>
        ) : (
          <p className="no-projects">No projects assigned to you</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
