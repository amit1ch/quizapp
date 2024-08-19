import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import './Question.css'
import {  useNavigate } from 'react-router-dom';
export default function Questions({ questions = [] ,quizId }) {
    const { handleSubmit, control, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async(data) => {
         console.log('Selected Answers:',data);
       const answer = Object.values(data); 
        console.log("answer",answer);
        const response = await axios.post("http://localhost:3000/api/v1/quiz/check-quiz",{answer,quizId},{withCredentials:true})
        console.log(response)
        navigate('/dashboard');
        
    };

    if (questions.length === 0) {
        return <p>No questions available.</p>;
    }

    return (
        <div className="form-wrapper"> 
        <form onSubmit={handleSubmit(onSubmit)}>
            { 
            
            questions.map((q, questionIndex) => (
                <div key={questionIndex} style={{ marginBottom: '20px' }}>
                        <h3 className='question-header'>
                          <span style={{marginRight:4}}>{questionIndex + 1}.</span>
                          
                          <span>{q.question}</span>
                        </h3>             
                        <div>
                        {q.answerOptions.map((option, optionIndex) => (
                            <div className='question-option' key={optionIndex}>
                                <Controller
                                    name={`question_${questionIndex}`}
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <label>
                                            <input
                                                type="radio"
                                                {...field}
                                                value={option}
                                                checked={field.value === option}
                                            />
                                            {option}
                                        </label>
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                    {errors[`question_${questionIndex}`] && (
                        <span style={{ color: 'red' }}>This field is required</span>
                    )}
                </div>
            ))}
            <button className='answersubmit' type="submit">Submit</button>
        </form>
        </div>
    );
}
