import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../css/navbar.css";

const AdminNavbar = () => {
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          to="/admin/dashboard"
          className={`nav-link ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/projects"
          className={`nav-link ${location.pathname === "/admin/projects" ? "active" : ""}`}
        >
          Projects
        </Link>
        <Link
          to="/admin/tasks"
          className={`nav-link ${location.pathname === "/admin/tasks" ? "active" : ""}`}
        >
          Tasks
        </Link>
        <Link
          to="/admin/reports"
          className={`nav-link ${location.pathname === "/admin/reports" ? "active" : ""}`}
        >
          Reports
        </Link>
      </div>
      <div className="navbar-right">
        {username ? <span className="user-name">Welcome, {username}</span> : null}
      </div>
    </nav>
  );
};

export default AdminNavbar;
