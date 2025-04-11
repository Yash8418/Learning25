import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./ProjectManagerNavbar"; 
import "../../css/tasks.css";

const TaskPage_pm = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskData, setEditTaskData] = useState({});

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getTask");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getAllProjects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/updateTask/${selectedTask._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editTaskData),
        }
      );

      if (res.ok) {
        alert("Task updated successfully!");
        fetchTasks();
        setSelectedTask(null);
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
        <h1 className="page-title">Tasks</h1>

        {/* Header - Filter & Add */}
        <div className="module-actions">
          <select
            onChange={(e) => setSelectedProject(e.target.value)}
            value={selectedProject}
            className="search-box"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>

          <Link to="/projectManager/addTask"> 
            <button className="new-module-btn">+ New Task</button>
          </Link>
        </div>

        {/* Task Grid */}
        <div className="module-list">
          {tasks
            .filter((task) => !selectedProject || task.project_id?._id === selectedProject)
            .map((task) => (
              <div
                key={task._id}
                className={`task-card priority-${task.priority.toLowerCase()}`}
                onClick={() => {
                  setSelectedTask(task);
                  setEditTaskData(task);
                  setIsEditMode(false);
                }}
              >
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Time:</strong> {task.totalMinutes} min</p>
                <p><strong>Status:</strong> {task.status_id?.statusName || "To Do"}</p>
                <p><strong>Project:</strong> {task.project_id?.title || "N/A"}</p>
                <p><strong>Module:</strong> {task.module_id?.moduleName || "N/A"}</p>
                <p><strong>Developers:</strong></p>
                <ul>
                  {task.dev_id && task.dev_id.length > 0 ? (
                    task.dev_id.map((dev) => (
                      <li key={dev._id}>{dev.username}</li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              </div>
            ))}
        </div>
      </div>

      {/* Popup */}
      {selectedTask && (
        <div className="popup-overlay" onClick={() => setSelectedTask(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedTask(null)}
            >
              ×
            </button>

            {!isEditMode ? (
              <>
                <h2>{selectedTask.title}</h2>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setIsEditMode(true);
                    setEditTaskData(selectedTask);
                  }}
                >
                  ✎ Edit
                </button>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p><strong>Total Minutes:</strong> {selectedTask.totalMinutes}</p>
                <p><strong>Status:</strong> {selectedTask.status_id?.statusName}</p>
                <p><strong>Project:</strong> {selectedTask.project_id?.title}</p>
                <p><strong>Module:</strong> {selectedTask.module_id?.moduleName}</p>
                <p><strong>Developers:</strong></p>
                <ul>
                  {selectedTask.dev_id && selectedTask.dev_id.length > 0 ? (
                    selectedTask.dev_id.map((dev) => (
                      <li key={dev._id}>{dev.username}</li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              </>
            ) : (
              <div className="edit-form">
                <label>Title:</label>
                <input
                  type="text"
                  value={editTaskData.title}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, title: e.target.value })
                  }
                />

                <label>Description:</label>
                <textarea
                  value={editTaskData.description}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      description: e.target.value,
                    })
                  }
                />

                <label>Total Minutes:</label>
                <input
                  type="number"
                  value={editTaskData.totalMinutes}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      totalMinutes: parseInt(e.target.value),
                    })
                  }
                />

                <label>Priority:</label>
                <select
                  value={editTaskData.priority}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, priority: e.target.value })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <div className="edit-actions">
                  <button onClick={handleSave}>✅ Save</button>
                  <button onClick={() => setIsEditMode(false)}>❌ Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage_pm;
