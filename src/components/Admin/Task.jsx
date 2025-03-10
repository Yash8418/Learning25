import React, { useState } from "react";
import Navbar from "../common/Navbar"; // Adjust path if needed
import "../../css/task.css"; // Ensure this CSS file exists

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "User Authentication",
      description: "Implement user authentication system",
      estimatedHours: 8,
      status: "completed",
    },
    {
      id: 2,
      title: "Shopping Cart",
      description: "Build shopping cart functionality",
      estimatedHours: 16,
      status: "in_progress",
    },
    {
      id: 3,
      title: "UI Design",
      description: "Create mobile app UI design",
      estimatedHours: 24,
      status: "not_started",
    },
  ]);

  return (
    <div>
      <Navbar />
      <div className="tasks-container">
        <h1>Tasks</h1>
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-details">
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p className="estimated-time">
                  ⏳ {task.estimatedHours} hours estimated
                </p>
              </div>
              <div className="task-actions">
                {task.status === "completed" && (
                  <span className="status completed">✔ Completed</span>
                )}
                {task.status === "in_progress" && (
                  <>
                    <span className="status in-progress">⏳ In Progress</span>
                    <button className="stop-timer">⏹ Stop Timer</button>
                  </>
                )}
                {task.status === "not_started" && (
                  <>
                    <span className="status not-started">⚪ Not Started</span>
                    <button className="start-timer">▶ Start Timer</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;