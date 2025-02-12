import React from 'react'
import { useForm } from 'react-hook-form'

export const Form = () => {
    const {register,handleSubmit}=useForm()
    const submitHandler=(data)=>{
        console.log(data)
    }
  return (
    <div style={{textAlign:"center"}}>
        <h2>Diffferent types of form</h2>
        <form onSubmit={handleSubmit(submitHandler)}>
            <h3>User Info</h3>
            First Name: <input type="text" placeholder="First name" id="" {...register("firstname")}/> <br />
            Last Name: <input type="text" placeholder="Last name" id="" {...register("lastname")}/> <br />
            Age: <input type="number" placeholder="Age" id="" {...register("age")}/> <br />
            

            <h3>Food Form</h3>
            Item Name: <input type="text" placeholder="Item name" id="" {...register("itemname")}/> <br />
            Type: veg<input type="radio" name="ftype" {...register("ftype")} value={"veg"} /> 
                  non-veg<input type="radio" name="ftype" {...register("ftype")} value={"nonveg"} /> <br />
            Dishes: <select {...register("dish")} id="">
                <option value="pavbhaji">pav bhaji</option>
                <option value="chinese">chinese</option>
                <option value="punjabi">punjabi</option>
                <option value="gujarati">gujarati</option>
            </select>

            <h3>Hobbies</h3>
            select hobbies <br /> 
            Gaming<input type="checkbox" {...register("hobbies")} value={"gaming"} name="hobbies" /> <br />
            reading<input type="checkbox" {...register("hobbies")} value={"reading"} name="hobbies" /> <br />
            foodie<input type="checkbox" {...register("hobbies")} value={"foodie"} name="hobbies" /> <br />
            travel<input type="checkbox" {...register("hobbies")} value={"travel"} name="hobbies" />

            {/* single submit button */}
            <br /> <input type="submit" value="submit"/>
        </form>
        
    
    
    </div>
  )
}
