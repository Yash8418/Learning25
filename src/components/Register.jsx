import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
const clipboardIcon = "/clipboard.jpg"; // Image from public folder
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Developer");

  const handleRegister = () => {
    alert(`Registering ${username} as a ${role}`);
  };

  const navigate = useNavigate()
  const { register, handleSubmit } = useForm();

  const submitHandler = async (data) => {
    console.log("formData...", data);

    try {
        const res = await axios.post("/register", data, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(res.data);
        if (res.status === 200) {
            alert("Signup success");
            navigate("/login");
        } else {
            alert("Signup failed");
        }
    } catch (error) {
        console.error("Error registering:", error.response?.data || error.message);
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
          <button className="tab" onClick={() => navigate("/login")}>Login</button>
          <button className="tab active">Register</button>
        </div>

        {/* Form Fields */}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="input-group">
          <label>firstName</label>
          <input type="text" {...register("username")} />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
        </div>
        <div className="input-group">
        <label>Role</label>
        <select {...register("role")}>
          <option>Developer</option>
          <option>Manager</option>
          <option>Admin</option>
        </select>
        </div>
        <div>
          <input className="register-btn" type="submit" value="Signup" />
        </div>
      </form>

      {/* Right Section - Info */}
     
    </div>
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