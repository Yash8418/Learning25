// src/components/Developer/TimeTrackingHistory.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../Developer/DeveloperNavbar";
import "../../css/timeTrackingHistory.css";

const TimeTrackingHistory = () => {
  const [trackingHistory, setTrackingHistory] = useState([]);

  useEffect(() => {
    fetchTrackingHistory();
  }, []);

  const fetchTrackingHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/timeTrackingHistory");
      const data = await response.json();
      setTrackingHistory(data);
    } catch (error) {
      console.error("Error fetching time tracking history:", error);
    }
  };

  return (
    <div>
      <Navbar role="Developer" />
      <div className="tracking-history-container">
        <h1>Time Tracking History</h1>
        <div className="tracking-history-list">
          {trackingHistory.map((record) => (
            <div key={record._id} className="tracking-record">
              <p>Task: {record.task}</p>
              <p>Start Time: {record.startTime}</p>
              <p>End Time: {record.endTime}</p>
              <p>Duration: {record.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingHistory;
