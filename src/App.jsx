import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Header } from './component/Header'
import Footer from './component/Footer'
import Content from './component/Content'
import { AboutUs } from './component/AboutUs'
import { ArrayDemo } from './component/ArrayDemo'
import { UseStateDemo } from './component/UseStateDemo'
function App() {
  // Js ralated code will be here
// var   male=true;

  return (
    <div>
    {/* HTML RELATED CODE WILL BE HERE */}
    <UseStateDemo></UseStateDemo>
 {/* <Header></Header>
 <Content></Content>
 <AboutUs></AboutUs>
 <Footer></Footer> */}
 {/* <ArrayDemo></ArrayDemo> */}
 

      
      </div>
  )
}

export default App
