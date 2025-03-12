import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/styles.css";

const clipboardIcon = "/clipboard.jpg"; // Image from public folder

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      console.log("Form Data Submitted:", data);

      const res = await axios.post("/login", data);
      console.log("API Response:", res.data);

      if (res.status === 200) {
        localStorage.setItem("id", res.data.role._id);
        localStorage.setItem("role", res.data.role.role);
        localStorage.setItem("username", data.username); // Store username

        if (res.data.Message === "User FOUND successfully") {
          if (res.data.role.role === "Developer") {
            navigate("/developer");
          } else if (res.data.role.role === "Admin") {
            navigate("/admin");
          } else if (res.data.role.role === "Manager") {
            navigate("/projectManager");
          }
          alert("Login successful!");
        } else {
          alert("Invalid username or password!");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid username or password!");
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="form-container">
          <h2 className="title">Time Tracker</h2>
          <p className="subtitle">Manage your projects and track time efficiently</p>

          <div className="tabs">
            <button className="tab active">Login</button>
            <button className="tab" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="input-group">
              <label>User Name</label>
              <input type="text" {...register("username")} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" {...register("password")} required />
            </div>
            <button className="register-btn" type="submit">
              Login
            </button>
          </form>
        </div>

        <div className="info-container">
          <img src={clipboardIcon} alt="Clipboard Icon" />
          <h2 className="info-title">Track Time, Boost Productivity</h2>
          <p className="info-text">
            Efficiently manage projects, track time, and improve team productivity with our intuitive time tracking solution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
