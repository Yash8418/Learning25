
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../../css/Reports.css";
import Navbar from "./AdminNavbar";

const Reports = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Chart Data
  const charts = [
    {
      title: "Time per Developer",
      type: "bar",
      data: {
        labels: ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"],
        datasets: [
          {
            label: "Hours Worked",
            data: [24, 30, 14, 18],
            backgroundColor: "#34495E",
            borderRadius: 5,
          },
        ],
      },
    },
    {
      title: "Task Status Distribution",
      type: "pie",
      data: {
        labels: ["Todo", "In Progress", "Completed"],
        datasets: [
          {
            data: [27, 20, 53],
            backgroundColor: ["#3498DB", "#1ABC9C", "#F39C12"],
          },
        ],
      },
    },
    {
      title: "Weekly Progress",
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [
          {
            label: "Planned",
            data: [8, 8, 8, 8, 8],
            backgroundColor: "#2C3E50",
            borderRadius: 5,
          },
          {
            label: "Actual",
            data: [6, 7, 5, 9, 6],
            backgroundColor: "#ECF0F1",
            borderRadius: 5,
          },
        ],
      },
    },
  ];

  return (
    <>
      <Navbar />
      <div className="reports-container">
        <h1>Reports</h1>

        {/* Use Grid Layout for consistent 3-per-row alignment */}
        <div className="chart-row">
          {charts.map((chart, index) => (
            <div className="chart-card" key={index}>
              <h2>{chart.title}</h2>
              <div className="chart-wrapper">
                {chart.type === "bar" && <Bar data={chart.data} options={chartOptions} />}
                {chart.type === "pie" && <Pie data={chart.data} options={chartOptions} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Reports;
  
