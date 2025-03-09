import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../css/navbar.css" // Keep the same CSS

const Navbar = () => {
  const location = useLocation();

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
    </nav>
  );
};

export default Navbar;
