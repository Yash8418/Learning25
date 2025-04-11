import React, { useEffect, useState } from "react";
import Navbar from "./ProjectManagerNavbar";
import "../../css/project.css";
import { useNavigate } from "react-router-dom";


const ProjectManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectData, setEditProjectData] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:8000/getAllProjects/");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchModules = async (projectId) => {
    try {
      const res = await fetch(`http://localhost:8000/getProjectModule/${projectId}`);
      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:8000/getTask`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setSelectedModuleId(null);
    setSelectedTaskId(null);
    await fetchModules(project._id);
    await fetchTasks();
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Unknown";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateStr).toLocaleString("en-US", options);
  };

  const getStatusClass = (status) => {
    if (!status) return "task-unknown";
    const normalized = status.trim().toLowerCase();
  
    switch (normalized) {
      case "pending":
        return "task-pending";
      case "running":
        return "task-inprogress";
      case "completed":
        return "task-completed";
      default:
        return "task-unknown";
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="project-page-container">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">View and manage your assigned projects</p>

        <div className="project-actions">
          <input
            type="text"
            placeholder="Search projects..."
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="new-project-btn"
            onClick={() => navigate("/ProjectManager/addProject")}
          >
            + Add Project
          </button>

        </div>

        <div className="project-list">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                className="project-card"
                key={project._id}
                onClick={() => handleProjectClick(project)}
              >
                <h3>{project.title}</h3>
                <p><strong>Description:</strong> {project.description || "No description provided"}</p>
                <p><strong>Technology:</strong> {project.technology || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p>No projects match your search.</p>
          )}
        </div>
      </div>

      {selectedProject && (
        <div
          className="popup-overlay"
          onClick={() => {
            setSelectedProject(null);
            setSelectedModuleId(null);
            setSelectedTaskId(null);
          }}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => {
                setSelectedProject(null);
                setSelectedModuleId(null);
                setSelectedTaskId(null);
              }}
            >
              ×
            </button>

                            
            {!isEditMode ? (
              <>
                <h2>{selectedProject.title}</h2>
                <button className="edit-btn" onClick={() => {
                  setIsEditMode(true);
                  setEditProjectData(selectedProject);
                }}>
                  ✎ Edit
                </button>
              </>
            ) : (
              <div className="edit-form">
                <label>Title:</label>
                <input
                  type="text"
                  value={editProjectData.title}
                  onChange={(e) => setEditProjectData({ ...editProjectData, title: e.target.value })}
                />
                <label>Description:</label>
                <textarea
                  value={editProjectData.description}
                  onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                />
                <label>Technology:</label>
                <input
                  type="text"
                  value={editProjectData.technology}
                  onChange={(e) => setEditProjectData({ ...editProjectData, technology: e.target.value })}
                />
                <label>Estimated Hours:</label>
                <input
                  type="number"
                  value={editProjectData.estimatedHours}
                  onChange={(e) => setEditProjectData({ ...editProjectData, estimatedHours: parseInt(e.target.value) })}
                />
                <label>Start Date:</label>
                <input
                  type="datetime-local"
                  value={new Date(editProjectData.startDate).toISOString().slice(0, 16)}
                  onChange={(e) => setEditProjectData({ ...editProjectData, startDate: new Date(e.target.value).toISOString() })}
                />
                <label>Completion Date:</label>
                <input
                  type="datetime-local"
                  value={new Date(editProjectData.completionDate).toISOString().slice(0, 16)}
                  onChange={(e) => setEditProjectData({ ...editProjectData, completionDate: new Date(e.target.value).toISOString() })}
                />
                <div className="edit-actions">
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`http://localhost:8000/partialUpdateProject/${selectedProject._id}`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(editProjectData),
                      });

                      if (res.ok) {
                        alert("Project updated successfully!");
                        await fetchProjects(); // refresh
                        setIsEditMode(false);
                        setSelectedProject(null);
                      } else {
                        alert("Failed to update project");
                      }
                    } catch (err) {
                      console.error("Update error:", err);
                    }
                  }}>
                    ✅ Save
                  </button>
                  <button onClick={() => setIsEditMode(false)}>❌ Cancel</button>
                </div>
              </div>
            )}

            <p><strong>Start Date:</strong> {formatDateTime(selectedProject.startDate)}</p>
            <p><strong>Completion Date:</strong> {formatDateTime(selectedProject.completionDate)}</p>

            <h3>Modules</h3>
            {modules.length > 0 ? (
              modules.map((module) => (
                <div key={module._id} className="module-card_Project">
                  <div
                    className="module-header"
                    onClick={() =>
                      setSelectedModuleId(
                        selectedModuleId === module._id ? null : module._id
                      )
                    }
                  >
                    <h4>{module.moduleName}</h4>
                  </div>

                  {selectedModuleId === module._id && (
                    <div className="module-details">
                      <p><strong>Description:</strong> {module.description}</p>
                      <h5>Tasks</h5>
                      {tasks.filter((task) => task.moduleId === module._id).length > 0 ? (
                        tasks
                          .filter((task) => task.moduleId === module._id)
                          .map((task) => (
                            <div
                              // className="task-card"
                              className={`task-card_project ${getStatusClass(task.status_id?.statusName)}`}
                              key={task._id}
                              onClick={() =>
                                setSelectedTaskId(
                                  selectedTaskId === task._id ? null : task._id
                                )
                              }
                            >
                              <p><strong>Title:</strong> {task.title}</p>
                              <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status-tag ${getStatusClass(task.status_id?.statusName)}`}>
                                  {task.status_id?.statusName || "Unknown"}
                                </span>
                              </p>

                              {selectedTaskId === task._id && (
                                <div className="task-details">
                                  <h6>Task Details</h6>
                                  <p><strong>Description:</strong> {task.description}</p>
                                  <p><strong>Total Time:</strong> {task.totalMinutes} minutes</p>
                                  <p><strong>Priority:</strong> {task.priority}</p>
                                  {task.dev_id?.length > 0 && (
                                    <div>
                                      <p><strong>Developers:</strong></p>
                                      <li>
                                        {task.dev_id.map((dev) => (
                                          <li key={dev._id}>{dev.username}</li>
                                        ))}
                                      </li>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <p>No tasks available.</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No modules available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerProjects;
