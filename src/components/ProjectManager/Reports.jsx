// src/components/ProjectManager/Reports.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import "../../css/reports.css";

const Reports = () => {
  const [reportType, setReportType] = useState("project");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateReport(reportType);
  }, [reportType]);

  const generateReport = async (type) => {
    try {
      const response = await fetch(`http://localhost:8000/reports/${type}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div>
      <Navbar role="Project Manager" />
      <div className="reports-container">
        <h1>Reports and Analytics</h1>
        <div className="report-type-selector">
          <button onClick={() => setReportType("project")}>Project Report</button>
          <button onClick={() => setReportType("developer")}>Developer Report</button>
          <button onClick={() => setReportType("task")}>Task Report</button>
        </div>

        {reportData && (
          <div className="report-data">
            <h2>{reportType.toUpperCase()} Report</h2>
            {/* Display report data here */}
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
