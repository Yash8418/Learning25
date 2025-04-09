import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute

import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { AddProject } from "./components/Admin/AddProject";
import ProjectPage from "./components/Admin/Project";
// import Tasks from "./components/Admin/Task";
import Reports from "./components/Admin/Reports";

import DeveloperDashboard from "./components/Developer/DeveloperDashboard";
import DeveloperTasks from "./components/Developer/Tasks";
import DeveloperProjects from "./components/Developer/Projects";
import DeveloperReports from "./components/Developer/Reports";
import DeveloperNotifications from "./components/Developer/Notifications";
import DeveloperTimeTrackingHistory from "./components/Developer/TimeTrackingHistory";
import DeveloperSettings from "./components/Developer/Settings";

import ProjectManagerDashboard from "./components/ProjectManager/ProjectManagerDashboard";
import ProjectManagerProjects from "./components/ProjectManager/Projects";
import ProjectManagerDevelopers from "./components/ProjectManager/Developers";
import ProjectManagerReports from "./components/ProjectManager/Reports";
import ProjectManagerNotifications from "./components/ProjectManager/Notifications";
import ProjectManagerSettings from "./components/ProjectManager/Settings";

import axios from "axios";
import { AddProject_PM } from "./components/ProjectManager/AddProject_PM";
import Module from "./components/Admin/Module";
import AddModule from "./components/Admin/AddModule";
import TaskPage from "./components/Admin/TaskPage";
import AddTask from "./components/Admin/AddTask";
import TaskPage_pm from "./components/ProjectManager/TaskPage";
import AddTask_pm from "./components/ProjectManager/AddTask";
import AddModule_pm from "./components/ProjectManager/AddModule";
import Module_pm from "./components/ProjectManager/Module";
import Developers from "./components/Admin/Developers";

function App() {
  axios.defaults.baseURL = "http://localhost:8000";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/addProject" element={<AddProject />} />
          <Route path="/admin/projects" element={<ProjectPage />} />
          <Route path="/admin/taskpage" element={<TaskPage />} />
          <Route path="/admin/addTask" element={<AddTask />} />
          <Route path="/admin/developers" element={<Developers />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/module" element={<Module/>} />
          <Route path="/admin/addModule" element={<AddModule />} />

        </Route>

        {/* Developer Routes */}
        <Route element={<PrivateRoute allowedRoles={["Developer"]} />}>
          <Route path="/developer" element={<Navigate to="/developer/dashboard" />} />
          <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
          <Route path="/developer/tasks" element={<DeveloperTasks />} />
          <Route path="/developer/projects" element={<DeveloperProjects />} />
          <Route path="/developer/reports" element={<DeveloperReports />} />
          <Route path="/developer/notifications" element={<DeveloperNotifications />} />
          <Route path="/developer/time-tracking" element={<DeveloperTimeTrackingHistory />} />
          <Route path="/developer/settings" element={<DeveloperSettings />} />
        </Route>

        {/* Project Manager Routes */}
        <Route element={<PrivateRoute allowedRoles={["Manager"]} />}>
          <Route path="/ProjectManager" element={<Navigate to="/ProjectManager/dashboard" />} />
          <Route path="/ProjectManager/dashboard" element={<ProjectManagerDashboard />} />
          <Route path="/ProjectManager/projects" element={<ProjectManagerProjects />} />
          <Route path="/ProjectManager/addProject" element={<AddProject_PM/>} />
          <Route path="/ProjectManager/addModule" element={<AddModule_pm />} />
          <Route path="/ProjectManager/module" element={<Module_pm />} />
          {/* <Route path="/ProjectManager/tasks" element={<ProjectManagerTasks />} /> */}
          <Route path="/ProjectManager/addTask" element={<AddTask_pm />} />
          <Route path="/ProjectManager/tasks" element={< TaskPage_pm/>} />
          <Route path="/ProjectManager/developers" element={<ProjectManagerDevelopers />} />
          <Route path="/ProjectManager/reports" element={<ProjectManagerReports />} />
          <Route path="/ProjectManager/notifications" element={<ProjectManagerNotifications />} />
          <Route path="/ProjectManager/settings" element={<ProjectManagerSettings />} />
        </Route>

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
