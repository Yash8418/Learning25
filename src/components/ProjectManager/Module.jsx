import React, { useEffect, useState } from "react";
import Navbar from "./ProjectManagerNavbar";
import { useNavigate } from "react-router-dom";
import "../../css/module.css";

const Module_pm = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("http://localhost:8000/getProjectModule");
        const data = await response.json();
        setModules(data);
      } catch (err) {
        setError("Failed to fetch modules");
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/getTask");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
    fetchTasks();
  }, []);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setSelectedTaskId(null);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
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

  const filteredModules = modules.filter((mod) =>
    mod.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="module-page-container">
        <h1 className="page-title">Modules</h1>
        <p className="page-subtitle">Manage and track all your project modules</p>

        <div className="module-actions">
          <input
            type="text"
            placeholder="Search modules..."
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="new-module-btn"
            onClick={() => navigate("/ProjectManager/addModule")}
          >
            + New Module
          </button>
        </div>

        {loading ? (
          <p>Loading modules...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredModules.length > 0 ? (
          <div className="module-list">
            {filteredModules.map((module) => (
              <div
                className="module-card"
                key={module._id}
                onClick={() => handleModuleClick(module)}
              >
                <h3>{module.moduleName}</h3>
                <p>{module.description}</p>
                <div className="module-meta">
                  <strong>Project:</strong> {module.project_id?.title || "Unknown"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-modules">No modules match your search.</p>
        )}
      </div>

      {/* Popup */}
      {selectedModule && (
        <div
          className="popup-overlay"
          onClick={() => {
            setSelectedModule(null);
            setSelectedTaskId(null);
          }}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => {
                setSelectedModule(null);
                setSelectedTaskId(null);
              }}
            >
              ×
            </button>

            <h2>{selectedModule.moduleName}</h2>
            <p><strong>Description:</strong> {selectedModule.description}</p>
            <p><strong>Project:</strong> {selectedModule.project_id?.title || "Unknown"}</p>
            <p><strong>Estimated Hours:</strong> {selectedModule.estimatedHours}</p>
            <p><strong>Start Date:</strong> {new Date(selectedModule.startDate).toLocaleDateString()}</p>

            <h4>Assigned Developers</h4>
            <ul>
              {selectedModule.dev_id?.length > 0 ? (
                selectedModule.dev_id.map((dev, index) => (
                  <li key={index}>{dev.username}</li>
                ))
              ) : (
                <li>No developers assigned</li>
              )}
            </ul>

            <h4>Tasks</h4>
            {tasks.filter((task) => task.moduleId === selectedModule._id).length > 0 ? (
              tasks
                .filter((task) => task.moduleId === selectedModule._id)
                .map((task) => {
                  const statusName = task.status_id?.statusName || "Unknown";
                  const taskStatusClass = getStatusClass(statusName);
                  return (
                    <div
                      key={task._id}
                      className={`task-card_module ${taskStatusClass}`}
                      onClick={() =>
                        setSelectedTaskId(selectedTaskId === task._id ? null : task._id)
                      }
                    >
                      <p><strong>Title:</strong> {task.title}</p>
                      <p><strong>Status:</strong> {statusName}</p>

                      {selectedTaskId === task._id && (
                        <div className="task-details">
                          <h5>Task Details</h5>
                          <p><strong>Description:</strong> {task.description}</p>
                          <p><strong>Total Time:</strong> {task.totalMinutes} minutes</p>
                          <p><strong>Priority:</strong> {task.priority}</p>

                          <h5>Assigned Developers</h5>
                          <ul>
                            {task.dev_id?.length > 0 ? (
                              task.dev_id.map((dev, i) => <li key={i}>{dev.username}</li>)
                            ) : (
                              <li>No developers</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Module_pm;
