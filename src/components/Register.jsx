import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../css/styles.css";

const clipboardIcon = "/clipboard.jpg"; // Image from public folder

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const submitHandler = async (data) => {
    console.log("Form Data Submitted:", data);

    try {
      const res = await axios.post("/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("API Response:", res.data);

      if (res.status === 200) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert("Signup failed. Check console for details.");
    }
  };

  return (
    <div className="container">
      {/* Left Section - Register Form */}
      <div className="form-container">
        <h2 className="title">Time Tracker</h2>
        <p className="subtitle">Manage your projects and track time efficiently</p>

        {/* Tabs */}
        <div className="tabs">
          <button className="tab" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="tab active">Register</button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="input-group">
            <label>First Name</label>
            <input type="text" {...register("username")} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" {...register("password")} required />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select {...register("role")} required>
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button className="register-btn" type="submit">
            Signup
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

export default Register;
