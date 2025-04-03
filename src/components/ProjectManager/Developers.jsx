import React, { useState, useEffect } from "react";
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import "../../css/developers.css";

const Developers = () => {
    const [developers, setDevelopers] = useState([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchDevelopers();
    }, []);

    // const fetchDevelopers = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8000/getAllUser");
    //         const data = await response.json();
    //         setDevelopers(data.filter((user) => user.role === "Developer"));
    //     } catch (error) {
    //         console.error("Error fetching developers:", error);
    //     }
    // };

    const fetchDevelopers = async () => {
      try {
          const response = await fetch("http://localhost:8000/getAllUser");
          const data = await response.json();
  
          const responseProjects = await fetch("http://localhost:8000/getAllProjects");
          const projectsData = await responseProjects.json();
  
          // Attach assigned projects to each developer
          const developersWithProjects = data
              .filter((user) => user.role === "Developer")
              .map((developer) => ({
                  ...developer,
                  assignedProjects: projectsData.filter((project) =>
                      project.assignedDevelopers.includes(developer._id)
                  ),
              }));
  
          setDevelopers(developersWithProjects);
      } catch (error) {
          console.error("Error fetching developers:", error);
      }
  };
  

    const fetchDeveloperProjects = async (developerId) => {
        try {
            const responseProjects = await fetch("http://localhost:8000/getAllProjects");
            const projectsData = await responseProjects.json();

            const responseTasks = await fetch("http://localhost:8000/getTask");
            const tasks = await responseTasks.json();

            const assignedProjects = projectsData
                .filter((project) => project.assignedDevelopers.includes(developerId))
                .map((project) => ({
                    _id: project._id,
                    title: project.title,
                    modules: {},
                }));

            tasks.forEach((task) => {
                if (task.assignedDevelopers.includes(developerId)) {
                    const projectId = task.project_id._id;
                    const projectIndex = assignedProjects.findIndex((p) => p._id === projectId);

                    if (projectIndex !== -1) {
                        const moduleId = task.module_id._id;

                        if (!assignedProjects[projectIndex].modules[moduleId]) {
                            assignedProjects[projectIndex].modules[moduleId] = {
                                name: task.module_id.moduleName,
                                tasks: [],
                            };
                        }

                        assignedProjects[projectIndex].modules[moduleId].tasks.push({
                          title: task.title,
                          status: task.status_id?.statusName || "Unknown",
                          time: task.totalMinutes, // Ensure this is correctly extracted
                      });
                      
                    }
                }
            });

            setProjects(assignedProjects);
        } catch (error) {
            console.error("Error fetching tasks/projects:", error);
        }
    };

    const handleDeveloperSelect = (developer) => {
        setSelectedDeveloper(developer);
        fetchDeveloperProjects(developer._id);
    };

    const handleProjectClick = (project) => {
        setSelectedProject(selectedProject?._id === project._id ? null : project);
    };

    const closePopup = () => {
        setSelectedDeveloper(null);
        setProjects([]);
        setSelectedProject(null);
    };

    return (
        <div>
            <Navbar role="Project Manager" />
            <div className="developers-container">
                <h1>Developers</h1>
                <div className="developers-list">
                    {developers.map((developer) => (
                        <div
                            key={developer._id}
                            className={`developer-card ${selectedDeveloper?._id === developer._id ? "selected" : ""}`}
                            onClick={() => handleDeveloperSelect(developer)}
                        >
                            <h2>{developer.username}</h2>
                            <p>Email: {developer.email}</p>
                            {/* <p>Current Project: {developer.currentProject || "Not Assigned"}</p> */}
                            <p>
                                Assigned Projects:{" "}
                                {developer.assignedProjects && developer.assignedProjects.length > 0
                                    ? developer.assignedProjects.map((project, index) => (
                                          <span key={project._id}>
                                              {project.title}
                                              {index !== developer.assignedProjects.length - 1 ? ", " : ""}
                                          </span>
                                      ))
                                    : "Not Assigned"}
                            </p>

                        </div>
                    ))}
                </div>
            </div>

            {selectedDeveloper && (
                <div className="full-screen-overlay" onClick={closePopup}>
                    <div className="full-screen-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closePopup}>×</button>
                        <h2>{selectedDeveloper.username}</h2>
                        <p>Email: {selectedDeveloper.email}</p>
                        <h3>Assigned Projects</h3>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <div key={project._id} className="project-section">
                                    <h3
                                        className={`project-title ${selectedProject?._id === project._id ? "active" : ""}`}
                                        onClick={() => handleProjectClick(project)}
                                    >
                                        Project Name : {project.title}
                                    </h3>

                                    {selectedProject?._id === project._id && (
                                        <div className="modules-container">
                                            {Object.values(project.modules).length > 0 ? (
                                                Object.values(project.modules).map((module) => (
                                                    <div key={module.name} className="module-section">
                                                        <h4>Module Name: {module.name}</h4>
                                                        {module.tasks.length > 0 ? (
                                                           <ul>
                                                           {module.tasks.map((task, index) => (
                                                               <li key={index}>
                                                                   <p><strong>Task:</strong> {task.title}</p>
                                                                   <p><strong>Status:</strong> {task.status}</p>
                                                                   <p><strong>Time:</strong> {task.time} minutes</p> {/* Display time correctly */}
                                                               </li>
                                                           ))}
                                                       </ul>
                                                       
                                                        ) : (
                                                            <p>No tasks assigned</p>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No modules available</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No assigned projects.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Developers;
