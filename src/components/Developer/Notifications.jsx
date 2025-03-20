// src/components/Developer/Notifications.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import "../../css/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/developerNotifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div>
      <Navbar role="Developer" />
      <div className="notifications-container">
        <h1>Notifications</h1>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification._id} className="notification-card">
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
