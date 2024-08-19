import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './Login.css'
import axios from "axios";

import { useAuthContext } from "../AuthContext/AuthContext";
export default function Login(){
   
    const {login} =  useAuthContext();
    const [formdata,setFormdata] = useState({email:"",password:"" });


    const navigate = useNavigate();
    const mainpage = async(e) => {
        e.preventDefault();  
        
        const response = await axios.post("http://localhost:3000/api/v1/user/login",formdata,{withCredentials:true})
      
       if(response.status===200){
         login(response?.data.user);
        navigate('/dashboard');  
       }  
    }
    const gotosignup = () => {
        navigate('/signUp');

    }
    return (
        <>
        
        

        <div className="login">
            <div className="login-main"> 
                <div className="login-header">  <h1>Login</h1>  </div>
            <form action="submit" onSubmit={mainpage}>
                <div className="login-form-input">
                    <label htmlFor="email">Email</label>
                    <input type='text' id='email' name='email'
                    onChange={(e)=>{
                        setFormdata({...formdata,email : e.target.value})   
                   }}
                    required/>
                </div>
                <div className="login-form-input">
                    <label htmlFor="password">Password</label>
                    <input type='text' id='password' name='password' 
                    onChange={(e)=>{
                        setFormdata({...formdata,password : e.target.value})   
                   }}
                    required/>
                </div>
                <button type="submit" className= "loginbutton">Login</button>
            </form>
            <div className="account-not-exit">
             <p  > Create Account ? <small onClick={gotosignup} >Register</small> </p>
 
            </div>
            </div>
        </div>

        </>
    )
}