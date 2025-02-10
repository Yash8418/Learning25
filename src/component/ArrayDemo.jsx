import React from 'react'

export const ArrayDemo = () => {
  const students=[
    {
        name:"ansh",
        age:"20",
        marks:"89"
    },
    {
        name:"manthan",
        age:"22",
        marks:"79"
    },
    {
        name:"yash",
        age:"20",
        marks:"86"
    }
    
]
  const employees=[
    {
        id:"1001",
        name:"ansh",
        salary:"15000",
        gender:"male"
    },
    {
        id:"1002",
        name:"yash",
        salary:"16000",
        gender:"male"
    },
    {
        id:"1003",
        name:"shreya",
        salary:"25000",
        gender:"female"
    },
    {
        id:"1004",
        name:"seeta",
        salary:"16000",
        gender:"female"
    },
  ]

  const sales=[
    {
    id:"100",
    day:"mon",
    sales:"5000",
    discount:"50",
    profit:"500"
    },
    {
    id:"101",
    day:"tue",
    sales:"9600",
    discount:"30",
    profit:"600"
    },
    {
    id:"102",
    day:"wed",
    sales:"5500",
    discount:"60",
    profit:"590"
    },
    {
    id:"103",
    day:"th",
    sales:"95000",
    discount:"10",
    profit:"5000"
    },
    {
    id:"104",
    day:"fri",
    sales:"15000",
    discount:"30",
    profit:"500"
    },
  ]
  
    return (
    <div style={{textAlign:"center"}}>ArrayDemo
    <div style={{backgroundColor:"ButtonFace",textAlign:"center"}}>
        List of students: <br/>
        {students.map((stu)=>{
            return (
                <li>name: {stu.name }-- {stu.age}--{stu.marks}</li>
            )
        })}

        
    </div>
    <h1>Array demo 3</h1>
    List of employees:<br/>
    
    {  
    <table class="table table-dark">
        <thead>
            <tr>
            <th>id</th>
            <th>name</th>
            <th>salary</th>
            <th>gender</th>
            </tr>
        </thead>
        <tbody>
            {
                employees.map((emp)=>{
                    return <tr>
                        <td style={{color:emp.id=="1002"?"red":"black"}}>{emp.id}</td>
                        <td style={{backgroundColor:emp.name.startsWith("s")?"red":"green"}}>{emp.name}</td>
                        <td style={{color:emp.salary>15000?"Highlight":"GrayText"}}>{emp.salary}</td>
                        <td style={{backgroundColor:emp.gender=="male"?"blue":"pink"}}>{emp.gender}</td>
                        
                        </tr>
                })
            }
        </tbody>

    </table>
    }

    <br />
    <h2 style={{textAlign:"center"}}>Home work demo 2</h2>
    <table class="table table-dark">
    <thead>
    <tr>
    <th>id</th>    
    <th>day</th>    
    <th>sales</th>    
    <th>discount</th>    
    <th>profit</th>    
    </tr>    
    </thead>    
    <tbody>
        {
            sales.map((sl)=>{
               return <tr >
                    <td>
                        {sl.id}
                    </td>
                    <td>
                        {sl.day}
                    </td>
                    <td>
                        {sl.discount}
                    </td>
                    <td>
                        {sl.sales}
                    </td>
                    <td>
                        {sl.profit}
                    </td>
                </tr>
            })
        }
    </tbody>
    </table>    

    
    </div>
  )
}
