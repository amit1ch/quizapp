 
import {  useNavigate } from 'react-router-dom';
import React,{useState} from "react";
import axios from "axios";
import "./SignUp.css";

export default function SignUp() {
    const [formdata,setFormdata] = useState({name:"",username:"",password:"",comfirmpassword:"",email:""});
    const navigate = useNavigate();

    const mainpage = async (e) => {
       try{ e.preventDefault();

        const response = await axios.post("http://localhost:3000/api/v1/user/register",formdata)
      console.log(response.data);
      if(response.status===201){
        navigate("/dashboard")
      }

      else{

        alert("wrong info");
      }


    }catch(error){
        console.log(error)

    }
}
    const loginpage =()=>{
        navigate('/login');
    }

    

    return (
        <>
            <div className="signup">
                <div className="signup-main">

                <div className="signup-header">  <h1>Sign Up</h1>  </div>

                    <form onSubmit={mainpage}>
                        <div className="signup-form-input">
                            <label htmlFor="name">Name</label>
                            <input type='text' id='name' name='name' onChange={(e)=>{
                                 setFormdata({...formdata,name : e.target.value})   
                            }} required />
                        </div>
                        <div className="signup-form-input">
                            <label htmlFor="email">Email</label>
                            <input type='email' id='email' name='email'onChange={(e)=>{
                                 setFormdata({...formdata,email : e.target.value})   
                            }} required />
                        </div>
                        <div className="signup-form-input">
                            <label htmlFor="username">User Name</label>
                            <input type='text' id='username' name='username' onChange={(e)=>{
                                 setFormdata({...formdata,username : e.target.value})   
                            }} required />
                        </div>
                        <div className="signup-form-input">
                            <label htmlFor="password">Password</label>
                            <input type='password' id='password' name='password' onChange={(e)=>{
                                 setFormdata({...formdata,password : e.target.value})   
                            }} required />
                        </div>
                        <div className="signup-form-input">
                            <label htmlFor="confirmpassword">Confirm Password</label>
                            <input type='password' id='confirmpassword' name='confirmpassword' onChange={(e)=>{
                                 setFormdata({...formdata,confirmpassword : e.target.value})   
                            }} required />
                        </div>
                        <button type="submit" className="signupbutton"  >Sign Up</button>
                    </form>
                    <div className="acount-exit"  >
                        <p >Account Already Exists ? <small onClick={loginpage}>Login</small> </p>
                    </div>
                </div>
            </div>
        </>
    );
}
