
import { useNavigate } from 'react-router-dom'
import './DashNavbar.css'
import { useState ,useEffect} from 'react';
import axios from 'axios';
import { useAuthContext } from '../AuthContext/AuthContext';
 export default function DashNavbar(){
    const {logout}=useAuthContext()
    const [userRole,setUserRole] = useState("");
 
    const navigate = useNavigate();
    const showstate=()=>{
        navigate('/stats');
    }
    const showhome =()=>{
        navigate('/dashboard');
    }
    const logoutUser = async()=>{
         
        const response = await axios.get("https://quiz-application-32b5.onrender.com/api/v1/user/logout",{withCredentials:true});

        if(response?.data?.statusCode===203){
            logout()
            navigate('/login');
        }
       
    }
    useEffect(()=>{
        async function getUserdetail(){
            console.log("hello");
            const response = await axios.get("https://quiz-application-32b5.onrender.com/api/v1/user/profile",{withCredentials:true});
            console.log(response?.data?.role);
            setUserRole(response?.data?.role);
        }
        getUserdetail();
    },[])
        
    const createquiz=()=>{
        console.log(userRole);
     if(userRole==="admin"){
        navigate("/create-quiz-form");
     }else{
        alert("You does't have access to create quiz");
     }

        
    }

    return (
        <>
            <div className="dashnav">
                
                <div className="dashnavtop"> 

                 <div className="gamename" style={{display:'flex',justifyContent:'flex-start',alignItems:'center'}}>Quiz App</div>
                    <div className="home" style={{ cursor: 'pointer',display:'flex',justifyContent:'flex-start',alignItems:'center' }} onClick={showhome} >Home</div>
                
                    <div className='state' style={{ cursor: 'pointer',display:'flex',justifyContent:'flex-start',alignItems:'center' }} onClick={showstate} >Stats</div>
                    <div className='create-quiz' style={{ cursor: 'pointer',display:'flex',justifyContent:'flex-start',alignItems:'center' }} onClick = {createquiz}>Create Quiz</div>
                </div>
                <div className='logout'   onClick ={logoutUser}>Logout</div>
            </div>
        </>
    )
}