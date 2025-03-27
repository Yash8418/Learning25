// src/components/Developer/Tasks.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../Developer/DeveloperNavbar";
import "../../css/tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/getTasksForDeveloper");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleChangeStatus = async (taskId, newStatus) => {
    try {
      await fetch(`http://localhost:8000/updateTaskStatus/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div>
      <Navbar role="Developer" />
      <div className="tasks-container">
        <h1>Tasks</h1>
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => handleChangeStatus(task._id, "In Progress")}>
                Start Task
              </button>
              <button onClick={() => handleChangeStatus(task._id, "Completed")}>
                Mark as Complete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
