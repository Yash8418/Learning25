// src/components/ProjectManager/Tasks.jsx
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import React, { useState, useEffect } from "react";
import "../../css/task.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/getTask");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <Navbar role="Project Manager" />
      <h1>Tasks</h1>
      <div className="tasks-container">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            {/* Add buttons for changing status or assigning developers */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
