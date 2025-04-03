// import React, { useEffect, useState } from "react";
// // import "../../css/module.css";
// import Navbar from "./AdminNavbar";
// import { useNavigate } from "react-router-dom";

// const Module = () => {
//   const navigate = useNavigate();
//   const [modules, setModules] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/getProjectModule");
//         if (!response.ok) {
//           throw new Error("Failed to fetch modules");
//         }
//         const data = await response.json();
//         setModules(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchProjects = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/getAllProjects");
//         if (!response.ok) {
//           throw new Error("Failed to fetch projects");
//         }
//         const data = await response.json();
//         setProjects(data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };

//     fetchModules();
//     fetchProjects();
//   }, []);

//   return (
//     <div>
//       <Navbar />
//       <div className="module-page-container">
//         <h1 className="page-title">Modules</h1>
//         <p className="page-subtitle">Manage and track all your project modules</p>

//         <div className="module-actions">
//           <input type="text" placeholder="Search modules..." className="search-box" />
//           <button className="new-module-btn" onClick={() => navigate("/admin/addModule")}>
//             + New Module
//           </button>
//         </div>

//         {loading ? (
//           <p>Loading modules...</p>
//         ) : error ? (
//           <p className="error-message">Failed to fetch modules: {error}</p>
//         ) : modules.length > 0 ? (
//           <div className="module-list">
//             {modules.map((module) => (
//               <div key={module.id} className="module-card">
//                 <h3>{module.name}</h3>
//                 <p>{module.description}</p>
//                 <span>Project: {module.projectName}</span>
//                 <p>Estimated Hours: {module.estimatedHours}</p>
//                 <p>Start Date: {new Date(module.startDate).toLocaleDateString()}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="no-modules">No modules available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Module;


import React, { useEffect, useState } from "react";
import Navbar from "./ProjectManagerNavbar";
import { useNavigate } from "react-router-dom";
import "../../css/module.css";

const ModuleCard = ({ moduleName, description, project_id, estimatedHours, startDate, dev_id }) => {
  const projectName = project_id ? project_id.title : "Unknown Project";

  return (
    <div className="module-card">
      <h3>{moduleName}</h3>
      <p>{description}</p>
      <div className="module-info">
        <span><strong>Project:</strong> {projectName}</span> <br />
        <span><strong>Estimated Hours:</strong> {estimatedHours}</span> <br />
        <span><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</span> <br />

        {/* ✅ Fixed Assigned Developers Mapping */}
        <span><strong>Assigned Developers:</strong></span>
        <ul>
          {dev_id && dev_id.length > 0 ? (
            dev_id.map((dev, index) => (
              <li key={index}>{dev.username || "Unknown Developer"}</li>
            ))
          ) : (
            <li>No developers assigned</li>
          )}
        </ul>
      </div>
    </div>
  );
};


const Module_pm = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("http://localhost:8000/getProjectModule");
        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }
        const data = await response.json();

        console.log("Modules Data:", data); // Debugging
        setModules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="module-page-container">
        <h1 className="page-title">Modules</h1>
        <p className="page-subtitle">Manage and track all your project modules</p>

        <div className="module-actions">
          <input type="text" placeholder="Search modules..." className="search-box" />
          <button className="new-module-btn" onClick={() => navigate("/ProjectManager/addModule")}>
            + New Module
          </button>
        </div>

        {loading ? (
          <p>Loading modules...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : modules.length > 0 ? (
          <div className="module-list">
            {modules.map((module) => (
              <ModuleCard key={module._id} {...module} />
            ))}
          </div>
        ) : (
          <p className="no-modules">No modules available</p>
        )}
      </div>
    </div>
  );
};

export default Module_pm;