import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        if (res.data.Message === "User FOUND successfully") {
          if (res.data.role === "Developer") {
            navigate("/developer");
          } else if (res.data.role === "Admin" || res.data.role === "Manager") {
            navigate("/admin");
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
    <div className="container">
      {/* Left Section - Login Form */}
      <div className="form-container">
        <h2 className="title">Time Tracker</h2>
        <p className="subtitle">Manage your projects and track time efficiently</p>

        {/* Tabs */}
        <div className="tabs">
          <button className="tab active">Login</button>
          <button className="tab" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        {/* Form Fields */}
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

      {/* Right Section - Info */}
      <div className="info-container">
        <img src={clipboardIcon} alt="Clipboard Icon" />
        <h2 className="info-title">Track Time, Boost Productivity</h2>
        <p className="info-text">
          Efficiently manage projects, track time, and improve team productivity with our intuitive time tracking solution.
        </p>
      </div>
    </div>
  );
};

export default Login;
