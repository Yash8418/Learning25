import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Header } from './component/Header'
import Footer from './component/Footer'
import Content from './component/Content'
import { AboutUs } from './component/AboutUs'
function App() {
  // Js ralated code will be here
// var   male=true;

  return (
    <div>
    {/* HTML RELATED CODE WILL BE HERE */}
 <Header></Header>
 <Content></Content>
 <AboutUs></AboutUs>
 <Footer></Footer>

      
      </div>
  )
}

export default App
