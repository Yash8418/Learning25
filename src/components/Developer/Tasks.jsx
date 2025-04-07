// src/components/Developer/Tasks.jsx
import React, { useState, useEffect } from "react";
import DeveloperNavbar from "./DeveloperNavbar";
import "../../css/task.css"

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const formatTime = (timeSpent) => {
    if (!timeSpent || timeSpent <= 0) return "00:00:00";
    const totalSeconds = Math.floor(timeSpent);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getAllTasksByDeveloperId/${localStorage.getItem("id")}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/startTask/${taskId}`, { method: "PUT" });
      fetchTasks();
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const handleStopTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/stopTask/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? { ...task, ...data } : task));
      fetchTasks();
    } catch (error) {
      console.error("Error stopping task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/completeTask/${taskId}`, { method: "PUT" });
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const pendingTasks = tasks.filter(task => task.status_id?.statusName === "pending");
  const runningTasks = tasks.filter(task => task.status_id?.statusName === "running");
  const completedTasks = tasks.filter(task => task.status_id?.statusName === "completed");

  return (
    <div>
      <DeveloperNavbar role="Developer" />
      <div className="tasks-container">
        <h1>Tasks</h1>
        <div className="kanban-board">
          {/* Pending */}
          <div className="kanban-column pending">
            <h2>Pending</h2>
            {pendingTasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status_id?.statusName ?? "Unknown"}</p>
                <p>Total Time Spent: {formatTime(task.timeSpent)}</p>
                <button onClick={() => handleStartTask(task._id)} className="start-timer">Start Task</button>
                <button onClick={() => handleCompleteTask(task._id)} className="add-task">Complete Task</button>
              </div>
            ))}
          </div>

          {/* Running */}
          <div className="kanban-column running">
            <h2>Running</h2>
            {runningTasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status_id?.statusName ?? "Unknown"}</p>
                <p>Total Time Spent: {formatTime(task.timeSpent)}</p>
                <button onClick={() => handleStopTask(task._id)} className="stop-timer">Stop Task</button>
                <button onClick={() => handleCompleteTask(task._id)} className="add-task">Complete Task</button>
              </div>
            ))}
          </div>

          {/* Completed */}
          <div className="kanban-column completed">
            <h2>Completed</h2>
            {completedTasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status_id?.statusName ?? "Unknown"}</p>
                <p>Total Time Spent: {formatTime(task.timeSpent)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
