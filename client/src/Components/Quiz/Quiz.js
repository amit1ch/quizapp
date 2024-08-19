
import Questions from "../Dashboard/Question/Question"
import { useLocation } from 'react-router-dom';
import './Quiz.css'
 export default function Quiz(){

    const location = useLocation();
    const { questions,quizId } = location.state || {};

    return(
        <>
        <div className="quizpage">

        <Questions questions = {questions} quizId = {quizId}/>

        </div>
        </>
    )
}