// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "../../css/PM_navbar.css";

// const ProjectManagerNavbar = () => {
//   const location = useLocation();
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, []);

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link
//           to="/ProjectManager/dashboard"
//           className={`nav-link ${location.pathname === "/ProjectManager/dashboard" ? "active" : ""}`}
//         >
//           Dashboard
//         </Link>
//         <Link
//           to="/ProjectManager/projects"
//           className={`nav-link ${location.pathname === "/ProjectManager/projects" ? "active" : ""}`}
//         >
//           Projects
//         </Link>
//         <Link
//           to="/ProjectManager/tasks"
//           className={`nav-link ${location.pathname === "/ProjectManager/tasks" ? "active" : ""}`}
//         >
//           Tasks
//         </Link>
//         <Link
//           to="/ProjectManager/developers"
//           className={`nav-link ${location.pathname === "/ProjectManager/developers" ? "active" : ""}`}
//         >
//           Developers
//         </Link>
//         <Link
//           to="/ProjectManager/reports"
//           className={`nav-link ${location.pathname === "/ProjectManager/reports" ? "active" : ""}`}
//         >
//           Reports
//         </Link>
//         <Link
//           to="/ProjectManager/notifications"
//           className={`nav-link ${location.pathname === "/ProjectManager/notifications" ? "active" : ""}`}
//         >
//           Notifications
//         </Link>
//         <Link
//           to="/ProjectManager/settings"
//           className={`nav-link ${location.pathname === "/ProjectManager/settings" ? "active" : ""}`}
//         >
//           Settings
//         </Link>
//       </div>
//       <div className="navbar-right">
//         {username ? <span className="user-name">Welcome, {username}</span> : null}
//       </div>
//     </nav>
//   );
// };

// export default ProjectManagerNavbar;


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/PM_navbar.css";

const ProjectManagerNavbar = () => {
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
          to="/ProjectManager/dashboard"
          className={`nav-link ${location.pathname === "/ProjectManager/dashboard" ? "active" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          to="/ProjectManager/projects"
          className={`nav-link ${location.pathname === "/ProjectManager/projects" ? "active" : ""}`}
        >
          Projects
        </Link>
        <Link
          to="/ProjectManager/tasks"
          className={`nav-link ${location.pathname === "/ProjectManager/tasks" ? "active" : ""}`}
        >
          Tasks
        </Link>
        <Link
          to="/ProjectManager/developers"
          className={`nav-link ${location.pathname === "/ProjectManager/developers" ? "active" : ""}`}
        >
          Developers
        </Link>
        <Link
          to="/ProjectManager/reports"
          className={`nav-link ${location.pathname === "/ProjectManager/reports" ? "active" : ""}`}
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
            <div className="dropdown-item" onClick={() => navigate("/ProjectManager/notifications")}>🔔 Notifications</div>
            <div className="dropdown-item" onClick={() => navigate("/ProjectManager/settings")}>⚙️ Settings</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProjectManagerNavbar;