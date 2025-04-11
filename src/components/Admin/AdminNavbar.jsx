import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/navbar.css";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
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

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    navigate("/login");
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
          to="/admin/module"
          className={`nav-link ${location.pathname === "/admin/modules" ? "active" : ""}`}
        >
          Modules
        </Link>
        <Link
          to="/admin/taskpage"
          className={`nav-link ${location.pathname === "/admin/taskpage" ? "active" : ""}`}
        >
          Tasks
        </Link>
         <Link
            to="/admin/developers"
            className={`nav-link ${location.pathname === "/admin/developers" ? "active" : ""}`}
          >
            Developers
          </Link>
        <Link
          to="/admin/reports"
          className={`nav-link ${location.pathname === "/admin/reports" ? "active" : ""}`}
        >
          Reports
        </Link>
       
      </div>

      
      <div className="navbar-right">
        {username ? (
          <div className="user-menu" onClick={toggleMenu}>
            Welcome, {username} ▼
          </div>
        ) : null}

        {menuOpen && (
          <div ref={menuRef} className="dropdown-card">
            {/* <div className="dropdown-item" onClick={() => navigate("/developer/notifications")}>
              🔔 Notifications
            </div> */}
            <div className="dropdown-item" onClick={() => navigate("/developer/settings")}>
              ⚙️ Settings
            </div>
            <div className="dropdown-item " onClick={handleLogout}>
              🚪 Sign Out
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
