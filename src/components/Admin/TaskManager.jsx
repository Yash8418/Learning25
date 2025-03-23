import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState({
    title: "",
    priority: "",
    description: "",
    totalMinutes: "",
    statusId: "",
    projectId: "",
    moduleId: "",
    userId: "",
  });

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [assignedDeveloper, setAssignedDeveloper] = useState("");
  const [developer, setDeveloper] = useState([]);
  const [timers, setTimers] = useState({}); // Track timers for each task

  // Fetch data from API on component mount
  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchDevelopers();
    fetchTasks();
  }, []);

  const fetchDevelopers=async()=> {
    try{
      const response = await axios.get("http://localhost:8000/getAllUser");
      const developer = response.data.filter((user) => user.role === "Developer");
      setDeveloper(developer);

    }
    catch (error) {
      console.error("Error fetching developers:", error);
    }

  }
  const handleDevelopersSelect = (event)=>{
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setDeveloper(selectedOptions);
    


  }
    // Fetch existing tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch available projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch available developers (users)
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch modules when a project is selected
  const fetchModules = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:8000/modules?projectId=${projectId}`);
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskInput({ ...taskInput, [name]: value });

    // If project changes, update modules dynamically
    if (name === "projectId") {
      fetchModules(value);
    }
  };

  // Add new task
  const handleAddTask = async () => {
    if (!taskInput.title || !taskInput.description || !taskInput.statusId) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/tasks", taskInput);
      setTasks([...tasks, response.data]); // Update UI with new task
      setTaskInput({
        title: "",
        priority: "",
        description: "",
        totalMinutes: "",
        statusId: "",
        projectId: "",
        moduleId: "",
        userId: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Start timer for a specific task
  const startTimer = (taskId) => {
    if (!timers[taskId]) {
      setTimers((prevTimers) => ({
        ...prevTimers,
        [taskId]: setInterval(() => {
          console.log(`Timer running for task ${taskId}`);
        }, 1000),
      }));
    }
  };

  // Stop timer for a specific task
  const stopTimer = (taskId) => {
    if (timers[taskId]) {
      clearInterval(timers[taskId]);
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers };
        delete newTimers[taskId];
        return newTimers;
      });
    }
  };

  return (
    <div className="task-manager">
      <h2>Task Manager</h2>

      {/* Input Fields */}
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={taskInput.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="priority"
        placeholder="Priority (Low, Medium, High)"
        value={taskInput.priority}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={taskInput.description}
        onChange={handleChange}
      />
      <input
        type="number"
        name="totalMinutes"
        placeholder="Total Minutes"
        value={taskInput.totalMinutes}
        onChange={handleChange}
      />

      {/* Dropdown Menus */}
     
    {/* drop down menu for selecting developer */}
    
      <select value={assignedDeveloper} onChange={(e) => setAssignedDeveloper(e.target.value)}>
        <option value="">Select Developer</option>
        {developer.map((dev) => (
          <option key={dev._id} value={dev._id}>
            {dev.username}
          </option>
        ))}
      </select>


      {/* Add Task Button */}
      <button onClick={handleAddTask}>Add Task</button>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Total Minutes:</strong> {task.totalMinutes}</p>
            <p><strong>Status:</strong> {task.statusId}</p>
            <p><strong>Project:</strong> {task.projectId}</p>
            <p><strong>Module:</strong> {task.moduleId}</p>
            <p><strong>Developer:</strong> {task.userId}</p>

            {/* Start & Stop Timer Buttons */}
            <button onClick={() => startTimer(task.id)} className="start-timer">▶ Start Timer</button>
            <button onClick={() => stopTimer(task.id)} className="stop-timer">⏹ Stop Timer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;