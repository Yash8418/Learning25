import React, { useEffect, useState } from "react";
import Navbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";
import "../../css/module.css";

const AdminModule = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModuleData, setEditModuleData] = useState({});
  const [isTaskEditMode, setIsTaskEditMode] = useState(false);
  const [editTaskData, setEditTaskData] = useState({});

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("http://localhost:8000/getProjectModule");
        const data = await response.json();
        setModules(data);
      } catch (err) {
        console.error("Failed to fetch modules");
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/getTask");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks");
      }
    };

    fetchModules();
    fetchTasks();
  }, []);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setSelectedTaskId(null);
    setIsEditMode(false);
    setIsTaskEditMode(false);
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

  const handleTaskEditSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/partialUpdateTask/${editTaskData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editTaskData),
      });

      if (res.ok) {
        alert("Task updated successfully!");
        const refreshedTasks = await fetch("http://localhost:8000/getTask");
        const updatedTasks = await refreshedTasks.json();
        setTasks(updatedTasks);
        setIsTaskEditMode(false);
        setSelectedTaskId(null);
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

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
            onClick={() => navigate("/admin/addModule")}
          >
            + New Module
          </button>
        </div>

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
      </div>

      {selectedModule && (
        <div
          className="popup-overlay"
          onClick={() => {
            setSelectedModule(null);
            setSelectedTaskId(null);
            setIsEditMode(false);
          }}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => {
                setSelectedModule(null);
                setSelectedTaskId(null);
                setIsEditMode(false);
              }}
            >
              ×
            </button>

            {!isEditMode ? (
              <>
                <h2>{selectedModule.moduleName}</h2>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setIsEditMode(true);
                    setEditModuleData({
                      moduleName: selectedModule.moduleName || "",
                      description: selectedModule.description || "",
                      estimatedHours: selectedModule.estimatedHours || 0,
                      startDate: selectedModule.startDate
                        ? selectedModule.startDate.split("T")[0]
                        : "",
                    });
                  }}
                >
                  ✎ Edit
                </button>
                <p><strong>Description:</strong> {selectedModule.description}</p>
                <p><strong>Project:</strong> {selectedModule.project_id?.title || "Unknown"}</p>
                <p><strong>Estimated Hours:</strong> {selectedModule.estimatedHours}</p>
                <p><strong>Start Date:</strong> {new Date(selectedModule.startDate).toLocaleDateString()}</p>
              </>
            ) : (
              <div className="edit-form">
                <label>Module Name:</label>
                <input
                  type="text"
                  value={editModuleData.moduleName}
                  onChange={(e) =>
                    setEditModuleData({ ...editModuleData, moduleName: e.target.value })
                  }
                />
                <label>Description:</label>
                <textarea
                  value={editModuleData.description}
                  onChange={(e) =>
                    setEditModuleData({ ...editModuleData, description: e.target.value })
                  }
                />
                <label>Estimated Hours:</label>
                <input
                  type="number"
                  value={editModuleData.estimatedHours}
                  onChange={(e) =>
                    setEditModuleData({
                      ...editModuleData,
                      estimatedHours: Number(e.target.value),
                    })
                  }
                />
                <label>Start Date:</label>
                <input
                  type="date"
                  value={editModuleData.startDate}
                  onChange={(e) =>
                    setEditModuleData({
                      ...editModuleData,
                      startDate: e.target.value,
                    })
                  }
                />
                <div className="edit-actions">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `http://localhost:8000/partialUpdateProjectModule/${selectedModule._id}`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(editModuleData),
                          }
                        );

                        if (res.ok) {
                          alert("Module updated successfully!");
                          const refreshed = await fetch("http://localhost:8000/getProjectModule");
                          const updated = await refreshed.json();
                          setModules(updated);
                          setSelectedModule(null);
                        } else {
                          const error = await res.text();
                          alert(`Failed to update module. ${error}`);
                        }
                      } catch (err) {
                        console.error("Error updating module:", err);
                      }
                    }}
                  >
                    ✅ Save
                  </button>
                  <button onClick={() => setIsEditMode(false)}>❌ Cancel</button>
                </div>
              </div>
            )}

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
                      onClick={() => {
                        setSelectedTaskId(task._id);
                        setEditTaskData({
                          _id: task._id,
                          taskName: task.taskName || "",
                          estimatedHours: task.estimatedHours || 0,
                        });
                        setIsTaskEditMode(true);
                      }}
                    >
                      <h5>{task.taskName}</h5>
                      <p><strong>Status:</strong> {statusName}</p>
                    </div>
                  );
                })
            ) : (
              <p>No tasks assigned to this module.</p>
            )}

            {isTaskEditMode && (
              <div className="edit-task-form">
                <h4>Edit Task</h4>
                <label>Task Name:</label>
                <input
                  type="text"
                  value={editTaskData.taskName}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, taskName: e.target.value })
                  }
                />
                <label>Estimated Hours:</label>
                <input
                  type="number"
                  value={editTaskData.estimatedHours}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, estimatedHours: Number(e.target.value) })
                  }
                />
                <div className="edit-actions">
                  <button onClick={handleTaskEditSave}>✅ Save Task</button>
                  <button
                    onClick={() => {
                      setIsTaskEditMode(false);
                      setSelectedTaskId(null);
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModule;
