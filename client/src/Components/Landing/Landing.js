import React from 'react'
import './Landing.css'
import {useNavigate} from 'react-router-dom'

const Landing = () => {

    const navigate = useNavigate();  

  const loginPage = () => {
    navigate('/login');  
  };
  const signup =()=>{
    navigate('/signUp');
  }


  return (
    <>
    <div className="container">
      <div className="firtnavbar">
        <div className="header-quiz"><h1>Quiz App</h1> </div>
        <div className="navbutton"> 
          <button className="startlogin" onClick={loginPage}>Login</button>
          <button className="startsignup" onClick={signup}>Sign Up</button>
        </div>
      </div>
      <div className="main">
        <div className="main-content">
          <h1> Start your Quiz</h1>  
          <button className="startgame" onClick={signup}>Start</button>
        </div>
      </div>

      <div className="footer">
        
      </div>
    </div>

    
  </>
  )
}

export default Landing
