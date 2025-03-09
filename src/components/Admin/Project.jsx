import React from "react";
import "../../css/project.css"; // Consistent naming like addProject.css
import Navbar from "../common/Navbar";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ title, description, hours, technology, Completion_Date }) => {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="project-info">
        <span> {hours} hours</span>
        <span> {technology} </span>
        <span> {Completion_Date} </span>
      </div>
      {/* <div className="project-footer">Last updated: {lastUpdated}</div>
      <span className="status">Active</span> */}
    </div>
  );
};

const ProjectPage = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: "E-commerce Platform",
      description: "Building a modern e-commerce platform with React and Node.js",
      hours: 35,
      technology: "Python",
      Completion_Date: "22-03-2025",
    //   lastUpdated: "2/21/2025",
    },
    {
      title: "Mobile App",
      description: "Developing a cross-platform mobile application",
      hours: 42,
      technology: "Java",
      Completion_Date: "25-03-2025",
    //   lastUpdated: "2/18/2025",
    },
    {
      title: "CRM System",
      description: "Customer relationship management system for internal use",
      hours: 50,
      technology: "MERN",
      Completion_Date: "28-03-2025",
    //   lastUpdated: "2/15/2025",
    },
  ];

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

        <div className="project-list">
          {projects.length > 0 ? (
            projects.map((project, index) => <ProjectCard key={index} {...project} />)
          ) : (
            <p className="no-projects">No projects available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
