import { useEffect, useState } from "react";
import DashNavbar from "../DashNavbar/DashNavbar";
import axios from "axios";
import './States.css';
import Mobilenav from "../Mobilenav/Mobilenav";

export default function States (){
    const [detail,setDetail] = useState({});
    const [maxScore,setMaxScore] = useState(0);
     useEffect(()=>{
        async function getUserdetail(){

            const response = await axios.get("https://quiz-application-32b5.onrender.com/api/v1/user/profile",{withCredentials:true});

            const data = response.data;


            const quizesTaken = Array.isArray(data.quizesTaken) ? data.quizesTaken : [];

         
        let maxi = 0;
        quizesTaken.forEach(quiz => {
            if (quiz.score > maxi) {
                maxi = quiz.score;
            }
        });

            setDetail({
                user_name: data.username,
                email: data.email,
                name: data.name,
                totalScore:data.totalScore,
                quizesTaken: Array.isArray(data.quizesTaken) ? data.quizesTaken : [], // Ensure it's an array
                totalQuiz: Array.isArray(data.quizesTaken) ? data.quizesTaken.length : 0,
                
                 

              });
           


           
            setMaxScore(maxi);

            


              
        }
        getUserdetail();
         
    },[])
        
    


    return (

        <>
        <div className="stats-container"> 
         <DashNavbar/>
        <div className="stats-main">
            <Mobilenav/>
            <ul className="userinfo"  >
                <li> <b> Name</b>  :  {detail.name}</li>
                <li><b> User_Name</b> :  {detail.user_name}</li>
                <li><b> Email</b>  :  {detail.email}</li>
            </ul>
            <div className="score-stats" style={{color:"white"}}>
                <div className="overall-score score-box"   >
                    <p>Over all score </p>
                    <h3>{detail.totalScore}</h3>
                </div>

                <div className="all-quiz-played score-box">
                    <p>Total quiz given </p>
                    <h3> {detail.totalQuiz}</h3>
                </div>
                <div className="max-score-quiz score-box">
                    <p>highest score  </p>
                    <h3>{maxScore}/20</h3>
                </div>
                <div className="last-score-quiz score-box">
                    <p>Recent Score</p>
                   {detail?.totalQuiz>0?<h3> { detail?.quizesTaken[detail?.totalQuiz-1].score}  </h3>:null}  
                </div>

            </div>
            <div className="all-user"></div>
        </div>
        </div>
        </>
    )
}