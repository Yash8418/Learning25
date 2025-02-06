import React from 'react'

const Content = () => {
  var details={
    name:"ansh",
    age:20,
    addr:'patan',
    male:true
   }
  return (
    <div style={{padding:"10px",backgroundColor:"ButtonText",color:"ButtonFace",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column"}}>
      {/* <style>{{backgroundColor:"black"}}</style> */}
      Hello World!!
      <p>put every thing in opening and closing tag</p>
      <p>Prajapti Ansh</p>
      <p>Sem 8th</p>
      <p>U.V. patel college of engineering</p>
      <h2>name= {details.name}</h2>
      <h2>name= {details.age}</h2>
      <h2>address= {details.addr}</h2>
      <h2>gender= {details.male==true?"male":"female"}</h2>
    </div>
  )
}

export default Content
