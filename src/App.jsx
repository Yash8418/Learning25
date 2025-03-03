import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./css/styles.css";  // Ensure correct CSS import
import axios from "axios";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { DeveloperDashboard } from "./components/Developer/DeveloperDashboard";
import { ProjectManagerDashboard } from "./components/ProjectManager/ProjectManagerDashboard";

function App() {
  axios.defaults.baseURL = "http://localhost:8000";

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/developer" element={<Navigate to="/developer/dashboard" />} />
          <Route path="/developer/dashboard" element={<DeveloperDashboard/>} />
          <Route path="/ProjectManager" element={<Navigate to="/ProjectManager/dashboard" />} />
          <Route path="/ProjectManager/dashboard" element={<ProjectManagerDashboard/>} />
        
        </Routes>
        {/* <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        </Routes> */}
      </div>
    </Router>
  );
}

export default App;