import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import "../../css/addProject.css"; 
import Navbar from "./ProjectManagerNavbar"; 

export const AddProject_PM = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [developers, setDevelopers] = useState([]);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);

    useEffect(() => {
        fetchDevelopers();
    }, []);

    const fetchDevelopers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/getAllUser");
            const devs = response.data.filter(user => user.role === "Developer");
            console.log(devs)
            // console.log(_id)
            setDevelopers(devs);
        } catch (error) {
            console.error("Error fetching developers:", error);
        }
    };

    const handleDeveloperSelect = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedDevelopers(selectedOptions);
    };
    // const handleDeveloperSelect = (event) => {
    //     const selectedDeveloperId = event.target.value; // Get only one value
    //     setSelectedDevelopers(selectedDeveloperId); // Store it as a string, not an array
    // };
    

    const submitHandler = async (data) => {
        if (new Date(data.completionDate) <= new Date(data.startDate)) {
            toast.error("❌ Completion date must be after the start date!", { position: "top-center" });
            return;
        }
        const userId = localStorage.getItem("id"); // Make sure "id" matches what you stored
            if (!userId) {
                toast.error("❌ User ID not found. Please log in again.");
                return;
            }

        try {

             // Retrieve user ID from localStorage
                
            data.userId = userId;   
            data.estimatedHours = parseInt(data.estimatedHours);
            data.startDate = new Date(data.startDate).toISOString();
            data.completionDate = new Date(data.completionDate).toISOString();
            data.assignedDevelopers = selectedDevelopers; // Assign selected developers
            // data.assignedDevelopers = JSON.stringify(
            //     developers
            //         .filter(dev => selectedDevelopers.includes(dev._id))
            //         .map(dev => dev._id)
            // );
            data.assignedDevelopers = developers
            .filter(dev => selectedDevelopers.includes(dev._id))
            .map(dev => dev._id);

            
            
            console.log(data);

            const res = await axios.post("/addProject", data);
            setMessage(res.data.Message);

            toast.success("🎉 Project added successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Slide,
            });
        } catch (error) {
            console.error("Error adding project", error);
            setMessage("Failed to add project");
            toast.error("❌ Failed to add project!", {
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
      <div>
          <Navbar />
          <ToastContainer />
          
          <div className="add-project-form">
              <h1>ADD PROJECT</h1>
              <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="form-group">
                      <label>Title</label>
                      <input type='text' {...register("title", { required: "Title is required" })} />
                      {errors.title && <p className="error-message">{errors.title.message}</p>}
                  </div>

                  <div className="form-group">
                      <label>Description</label>
                      <textarea {...register("description", { required: "Description is required" })} />
                      {errors.description && <p className="error-message">{errors.description.message}</p>}
                  </div>

                  <div className="form-group">
                      <label>Technology</label>
                      <input type='text' {...register("technology", { required: "Technology is required" })} />
                      {errors.technology && <p className="error-message">{errors.technology.message}</p>}
                  </div>

                  <div className="form-group">
                      <label>Estimated Hours</label>
                      <input type='number' {...register("estimatedHours", { required: "Estimated hours is required", min: { value: 1, message: "Must be at least 1 hour" } })} />
                      {errors.estimatedHours && <p className="error-message">{errors.estimatedHours.message}</p>}
                  </div>

                  <div className="form-group">
                      <label>Start Date</label>
                      <input type='datetime-local' {...register("startDate", { required: "Start date is required" })} />
                      {errors.startDate && <p className="error-message">{errors.startDate.message}</p>}
                  </div>

                  <div className="form-group">
                      <label>Completion Date</label>
                      <input type='datetime-local' {...register("completionDate", { required: "Completion date is required" })} />
                      {errors.completionDate && <p className="error-message">{errors.completionDate.message}</p>}
                  </div>

                  <div className="form-group">
                      <label>Assign Developers</label>
                      <select multiple onChange={handleDeveloperSelect} className="developer-select">
                          {developers.map(dev => (
                              <option key={dev._id} value={dev._id}>{dev.username}</option>
                          ))}
                      </select>
                  </div>

                  <button type='submit' className="submit-btn">ADD PROJECT</button>
              </form>
          </div>
      </div>
  );
};