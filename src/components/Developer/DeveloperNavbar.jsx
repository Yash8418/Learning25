import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/navbar.css";

const DeveloperNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/developer/dashboard" className={`nav-link ${location.pathname === "/developer/dashboard" ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/developer/tasks" className={`nav-link ${location.pathname === "/developer/tasks" ? "active" : ""}`}>
          Tasks
        </Link>
        <Link to="/developer/projects" className={`nav-link ${location.pathname === "/developer/projects" ? "active" : ""}`}>
          Projects
        </Link>
        <Link to="/developer/reports" className={`nav-link ${location.pathname === "/developer/reports" ? "active" : ""}`}>
          Reports
        </Link>
        {/* <Link to="/developer/time-tracking" className={`nav-link ${location.pathname === "/developer/time-tracking" ? "active" : ""}`}>
          Time Tracking
        </Link> */}
      </div>

      <div className="navbar-right">
        {username ? (
          <div className="user-menu" onClick={toggleMenu}>
            Welcome, {username} ▼
          </div>
        ) : null}

        {menuOpen && (
          <div ref={menuRef} className="dropdown-card">
            <div className="dropdown-item" onClick={() => navigate("/developer/notifications")}>
              🔔 Notifications
            </div>
            <div className="dropdown-item" onClick={() => navigate("/developer/settings")}>
              ⚙️ Settings
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DeveloperNavbar;
