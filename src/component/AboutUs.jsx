import React from 'react'
import img from "../assets/Screenshot 2024-01-17 110500.png"
import "../assets/aboutus.css"
export const AboutUs = () => {
  return (
    <div class="aboutus">
        {/* <iframe src={img} frameborder="0" width="50px" height="50px"></iframe> */}
        
        <p style={{width:"500px"}}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas similique architecto ut odit. Corrupti consectetur eos temporibus aliquid deleniti eaque laboriosam ab porro cupiditate ut earum blanditiis omnis, tempora explicabo.</p>
        <img src={img} alt="" id="img" />
    </div>
  )
}
