import  { React,useState, useEffect  } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";

import { RxHamburgerMenu } from 'react-icons/rx'; // Make sure this import is correct
import './Mobilenav.css'
const Mobilenav = () => {
    const [toggle, setToggle] = useState(false);
     const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [userRole,setUserRole] = useState("");
 
    const navigate = useNavigate();
    const showstate=()=>{
        navigate('/stats');
    }
    const showhome =()=>{
        navigate('/dashboard');
    }
    const logout = async()=>{

        const response = await axios.get("http://localhost:3000/api/v1/user/logout",{withCredentials:true});
 
        console.log(response);
        if(response?.data?.statusCode===203){
            navigate('/login');
        }
       
    }
    useEffect(()=>{
        async function getUserdetail(){

            const response = await axios.get("http://localhost:3000/api/v1/user/profile",{withCredentials:true});

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
            <div
                className='mobile-nav-icon'
                style={{ display: windowSize.width < 500 ? 'block' : 'none' }}
                onClick={() => setToggle(!toggle)}
            >
              {toggle===false?<RxHamburgerMenu style={{fontSize:30}} />:<RxCross2 style={{fontSize:30}}/>}   
            </div>
            {toggle && (
                <ul className="mobile-side-icon" style={{ display: windowSize.width < 500 ? 'flex' : 'none' }} >
                    <li>Quiz App</li>
                    <li onClick={showhome}>Home</li>
                    <li onClick={showstate}>Stats</li>
                    <li onClick={createquiz}>Create Quiz</li>
                    <li onClick={logout}>Log Out</li>
                </ul>
            )}
        </>
    );
};

export default Mobilenav;
