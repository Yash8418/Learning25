import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/styles.css";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
        localStorage.setItem("username", res.data.role.username); // Store username
        
  
        toast.success("🎉 Login successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Slide,
        });
  
        // Delay navigation by 2 seconds to allow toast to show
        setTimeout(() => {
          if (res.data.role.role === "Developer") {
            navigate("/developer");
          } else if (res.data.role.role === "Admin") {
            navigate("/admin");
          } else if (res.data.role.role === "Manager") {
            navigate("/projectManager");
          }
        }, 1000); // 1 seconds delay
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("❌ Invalid username or password!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });
    }
  };
  

  return (
    <div className="auth-container">
      <ToastContainer />
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
                <label>Email</label>
                <input type="email" {...register("username_or_email")} required />
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
