// src/components/Developer/Reports.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../Developer/DeveloperNavbar";
import "../../css/reports.css";

const Reports = () => {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch("http://localhost:8000/developerPerformanceReport");
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  return (
    <div>
      <Navbar role="Developer" />
      <div className="reports-container">
        <h1>Reports & Performance</h1>
        {performanceData && (
          <div className="performance-data">
            {/* Display performance reports */}
            <pre>{JSON.stringify(performanceData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
