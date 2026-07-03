import { useNavigate } from 'react-router-dom'
import './DashboardHome.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Mobilenav from '../Mobilenav/Mobilenav';
export default function DashboardHome(){
const [quizes,setQuizes]=useState([]);
   

    useEffect(() => {
        const getQuizes = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/v1/quiz/all-quizes", { withCredentials: true });
                console.log("Server response:", res);
    
                if (res.data) {
                    setQuizes(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        getQuizes();
    }, [setQuizes]);
    
    console.log("Quizzes state:", quizes);
    
    const navigate = useNavigate();

    const handleQuizClick = (quiz) => {
        navigate('/questions', { state: { questions: quiz.questions ,quizId:quiz._id} });
    };

    return (
        <> 
         <div className="dashhomecontainer">
            <Mobilenav/>
            <div className="dashhomemain">
                
                {quizes.length===0?<>No Quiz Found</>:  quizes?.map((quiz) => (
                    <div key={quiz._id} onClick={() => handleQuizClick(quiz)} style={{ cursor: 'pointer' }}>
                        <h2>{quiz.title}</h2>
                        <p>Level: {quiz.level}</p>
                        <h3>Topic: {quiz.tag?.map((tag, index) => <span key={index}>{tag}</span>)}</h3>
                    </div>
                ))}
            </div>
        </div>
         </>
    )
}