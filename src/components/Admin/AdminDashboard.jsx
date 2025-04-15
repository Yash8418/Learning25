import React, { useEffect, useState } from "react";
import Navbar from "../Admin/AdminNavbar";
import "../../css/dashboardcss.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import axios from "axios";
export const AdminDashboard = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [hoursThisWeek, setHoursThisWeek] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState([]);

  useEffect(() => {
    fetchTotalProjects();
    // fetchActiveTasks();
    fetchHoursThisWeek();
    fetchTasks();
  }, []);

  const fetchTotalProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/getAllProjects");
      const data = await response.json();
      setTotalProjects(data.length);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // const fetchActiveTasks = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8000/getActiveTasks");
  //     const data = await response.json();
  //     setActiveTasks(data.length);
  //   } catch (error) {
  //     console.error("Error fetching active tasks:", error);
  //   }
  // };

  // fetch all task
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getTask");
      // console.log(response.data);
      const data = response.data.filter((task) => task.status_id.statusName === "running");
      // console.log(data);
      setActiveTasks(data.length);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // const fetchHoursThisWeek = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8000/report/weekly-progress");
  //     const data = await response.json();
  //     console.log(data);
  //     const totalHours = data.actual / 3600; // Convert seconds to hours
  //     setHoursThisWeek(data.totalHours);
  //     console.log(totalHours);
  //     // Assuming data.weeklyHours = [{ day: 'Mon', hours: 6 }, ...]
  //     setWeeklyHours(data.planned);
  //     console.log(data.planned);
  //   } catch (error) {
  //     console.error("Error fetching weekly hours:", error);
  //   }
  // };

  const fetchHoursThisWeek = async () => {
    try {
      const response = await fetch("http://localhost:8000/report/weekly-progress");
      const data = await response.json();
  
      // Convert daily actual seconds -> array of hours
      const actualArray = Object.entries(data.actual).map(([day, seconds]) => ({
        day,
        hours: parseFloat((seconds / 3600).toFixed(2)) // Convert to hours
      }));
      
      // Save this array for chart
      setWeeklyHours(actualArray);
  
      // Calculate total hours from all days
      const totalHours = actualArray.reduce((sum, entry) => sum + entry.hours, 0).toFixed(2);
      setHoursThisWeek(totalHours);
    } catch (error) {
      console.error("Error fetching weekly hours:", error);
    }
  };
  
  

  return (
    <div className="admin-dashboard">
      <Navbar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, Admin</h1>
        </div>

        <div className="cards-container">
          <div className="card">
            <h3>Total Projects</h3>
            <p>{totalProjects}</p>
          </div>
          <div className="card">
            <h3>Active Tasks</h3>
            <p>{activeTasks}</p>
          </div>
          <div className="card">
            <h3>Hours This Week</h3>
            <p>{hoursThisWeek}</p>
          </div>
        </div>

        <div className="weekly-hours-container">
          <h3>Weekly Hours</h3>
          <div className="weekly-chart">
            <LineChart width={700} height={250} data={weeklyHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#0f172a" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};