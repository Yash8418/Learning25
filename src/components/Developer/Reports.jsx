import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
// import "../../css/reports.css"
// import "../../css/dev_report.css"
import "../../css/reports.css"
import Navbar from "../Developer/DeveloperNavbar";

const COLORS = ["#8884d8", "#82ca9d"];

const DeveloperReports = () => {
  const [developerId, setDeveloperId] = useState("");
  const [projectTimeData, setProjectTimeData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [avgTaskTimeData, setAvgTaskTimeData] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("id");
    // console.log("User ID from localStorage:", userData);
    setDeveloperId(userData);
  }, []);

  useEffect(() => {
    if (!developerId) return;
  fetchData();
  }, [developerId]);

  const fetchData = async () => {
    try {
      const developer_id = localStorage.getItem("id");
      // console.log("User ID from localStorage:", developer_id);
      setDeveloperId(developer_id);
      const [projectRes, statusRes, avgRes] = await Promise.all([
        axios.get(`http://localhost:8000/report/dev-total-time-per-project/${developer_id}`),
        axios.get(`http://localhost:8000/report/dev-task-status/${developerId}`),
        axios.get(`http://localhost:8000/report/dev-avg-time-task/${developerId}`)
      ]);
      const convertedProjectData = projectRes.data.map((item) => ({
        ...item,
        timeSpent: parseFloat((item.timeSpent / 60).toFixed(2)) // from minutes to hours
      }));
  
      setProjectTimeData(convertedProjectData);
      setTaskStatusData(statusRes.data);
      // setAvgTaskTimeData(avgRes.data);
      setAvgTaskTimeData([
        { task: "Average", averageTime: parseFloat((avgRes.data.averageTime / 60).toFixed(2)) }
      ]);
    } catch (error) {
      console.error("Error fetching developer report data:", error);
    }
  };

  return (
    <div className="p-6">
      <Navbar role="Developer" />
      <div className="reports-container">
      <h2 className="text-xl font-semibold">Developer Reports</h2>

      {/* Total Time per Project */}
      <div className="reports-grid">
      <div className="report-card">
        <h3>Total Time Spent per Project</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectTimeData}>
            <XAxis dataKey="project" />
            <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="timeSpent" fill="#8884d8" name="Total Minutes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

<div className="report-card">
  <h3>Task Completion Status</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={[
          { status: "Completed", count: taskStatusData.completed || 0 },
          { status: "Pending", count: taskStatusData.pending || 0 }
        ]}
        dataKey="count"
        nameKey="status"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        <Cell fill="#8884d8" /> {/* Purple for Completed */}
        <Cell fill="#82ca9d" /> {/* Green for Pending */}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

      {/* Average Time per Task */}
      <div className="report-card">
        <h3>Average Time per Task</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgTaskTimeData}>
            <XAxis dataKey="task" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageTime" fill="#82ca9d" name="Avg Minutes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
      </div>
    </div>
  );
};

export default DeveloperReports;