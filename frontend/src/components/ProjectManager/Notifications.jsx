// src/components/ProjectManager/Notifications.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../ProjectManager/ProjectManagerNavbar";
import "../../css/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleAcknowledge = async (notificationId) => {
    try {
      await fetch(`http://localhost:8000/acknowledgeNotification/${notificationId}`, {
        method: "POST",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error acknowledging notification:", error);
    }
  };

  return (
    <div>
      <Navbar role="Project Manager" />
      <div className="notifications-container">
        <h1>Notifications</h1>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification._id} className="notification-card">
              <p>{notification.message}</p>
              <button onClick={() => handleAcknowledge(notification._id)}>Acknowledge</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
