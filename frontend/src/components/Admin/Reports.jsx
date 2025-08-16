import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis,
} from "recharts";
import "../../css/reports.css"
import AdminNavbar from "../Admin/AdminNavbar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Reports = () => {
  const [timePerDeveloper, setTimePerDeveloper] = useState([]);
  const [taskStatusDistribution, setTaskStatusDistribution] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState({ planned: {}, actual: {} });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [devTimeRes, statusRes, weeklyRes] = await Promise.all([
          axios.get("http://localhost:8000/report/developer-time"),
          axios.get("http://localhost:8000/report/task-status"),
          axios.get("http://localhost:8000/report/weekly-progress"),
        ]);

        const convertedDevTime = devTimeRes.data.map(dev => ({
          username: dev.username,
          totalTime: +(dev.totalTime / 3600).toFixed(2), // Convert and round to 2 decimals
        }));

        setTimePerDeveloper(convertedDevTime);
        setTaskStatusDistribution(statusRes.data);
        setWeeklyProgress(weeklyRes.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const formattedTaskStatusData = taskStatusDistribution.map(item => ({
    name: item.statusName,
    value: item.count,
  }));

  const formattedWeeklyProgress = Object.keys(weeklyProgress.planned || {}).map(day => ({
    day,
    planned: weeklyProgress.planned[day] || 0,
    actual: weeklyProgress.actual?.[day] ? +(weeklyProgress.actual[day] / 3600).toFixed(2) : 0,
  }));


  return (
    <div className="p-6">
      <AdminNavbar />
      <div className="reports-container">
  {/* <h2 className="reports-title">Admin / Manager Reports</h2> */}
      <button
      onClick={() => window.open('http://localhost:8000/generate-report', '_parent')}
      className="report-btn"
    >
      Download Excel Report
    </button>
      <button
      onClick={() => window.open('http://localhost:8000/report/task-time-report', '_parent')}
      className="report-btn"
    >
      Download Task Report
    </button>

  <div className="reports-grid">
    {/* Time per Developer */}
    <div className="report-card">
      <h3>Time per Developer</h3>
      <BarChart width={500} height={250} data={timePerDeveloper}>
        <XAxis dataKey="username" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalTime" fill="#0f172a" />
      </BarChart>
    </div>

    {/* Task Status Distribution */}
    <div className="report-card">
      <h3>Task Status Distribution</h3>
      <PieChart width={350} height={250}>
        <Pie
          data={formattedTaskStatusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          label
        >
          {formattedTaskStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </div>
  </div>

  {/* Weekly Progress */}
  <div className="weekly-progress">
    <h3>Weekly Progress</h3>
    <BarChart width={680} height={250} data={formattedWeeklyProgress}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="planned" fill="#0f172a" />
      <Bar dataKey="actual" fill="#6e9394" />
    </BarChart>
  </div>
</div>

     {/* <h2 className="text-2xl font-bold mb-6">Admin / Manager Reports</h2>

      {/* Time per Developer */}
      {/*
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Time Spent Per Developer (Hours)</h3>
        <BarChart width={600} height={300} data={timePerDeveloper}>
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalTime" fill="#8884d8" />
        </BarChart>
      </div>
*/}
      {/* Task Status Distribution */}
      {/*}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Task Status Distribution</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={formattedTaskStatusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {formattedTaskStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      */}

      {/* Weekly Progress */}
      {/*}
      <div>
        <h3 className="text-xl font-semibold mb-2">Weekly Progress (Hours)</h3>
        <BarChart width={700} height={300} data={formattedWeeklyProgress}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="planned" fill="#00C49F" />
          <Bar dataKey="actual" fill="#FF8042" />
        </BarChart>
      </div> */}
    </div>


  );
};

export default Reports;