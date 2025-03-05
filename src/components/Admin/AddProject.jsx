import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../../css/addProject.css";

export const AddProject = () => {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');

  const submitHandler = async (data) => {
    try {
      data.estimatedHours = parseInt(data.estimatedHours);
      data.startDate = new Date(data.startDate).toISOString();
      data.completionDate = new Date(data.completionDate).toISOString();
      console.log(data);
      
      const res = await axios.post("/addProject", data);
      setMessage(res.data.Message);
    } catch (error) {
      console.error("Error adding project", error);
      setMessage("Failed to add project");
    }
  };

  return (
    <div className="add-project-container">
      <h1>ADD PROJECT</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit(submitHandler)}>
        
        <div className="form-group">
          <label>Title</label>
          <input type='text' {...register("title", { required: true })} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea {...register("description", { required: true })} />
        </div>

        <div className="form-group">
          <label>Technology</label>
          <input type='text' {...register("technology", { required: true })} />
        </div>

        <div className="form-group">
          <label>Estimated Hours</label>
          <input type='number' {...register("estimatedHours", { required: true })} />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input type='date' {...register("startDate", { required: true })} />
        </div>

        <div className="form-group">
          <label>Completion Date</label>
          <input type='date' {...register("completionDate", { required: true })} />
        </div>

        <button type='submit' className="submit-btn">ADD PROJECT</button>
      </form>
    </div>
  );
};
