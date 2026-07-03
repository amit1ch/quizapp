import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AiQuizform.css';

function CreateAiQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      tag: [''],
      level: '',
      category: [''],
      numberOfQuestion: 0,
      questions: [],
    }
  });

  const { fields: tagFields, append: appendTag } = useFieldArray({ control, name: 'tag' });
  const { fields: categoryFields, append: appendCategory } = useFieldArray({ control, name: 'category' });
  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({ control, name: 'questions' });

  const [prompt, setPrompt] = useState('');

  // AI quiz generation
  const generateQuiz = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/quiz/generate', { prompt });
      const quizData = response.data; // Expected format: { title, description, questions: [{ question, answerOptions, correctAnswer }] }

      setValue('title', quizData.title || '');
      setValue('description', quizData.description || '');
      setValue('questions', quizData.questions || []);
    } catch (err) {
      console.error(err);
      alert('Failed to generate quiz from AI');
    }
    setLoading(false);
  };

  const onSubmit = async (data) => {
    try {
        console.log("going to add the quiz")
        console.log(data);
      // const response = await axios.post("http://localhost:3000/api/v1/quiz/add-quiz", data, { withCredentials: true });
      const response = await axios.post(
        "http://localhost:3000/api/v1/quiz/add-quiz",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(response?.data);
      console.log("ky aha bahia")
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create AI Quiz</h2>
      
      <div>
        <label>Enter Prompt for AI Quiz</label>
        <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., 5-question JavaScript quiz" />
        <button type="button" onClick={generateQuiz} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      <form className='quizform' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label>
          <input {...register('title', { required: 'Title is required' })} />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label>Description</label>
          <input {...register('description', { required: 'Description is required' })} />
          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <div>
          <label>Tags</label>
          {tagFields.map((item, index) => (
            <div key={item.id}>
              <input {...register(`tag.${index}`)} />
            </div>
          ))}
          <button type="button" onClick={() => appendTag('')}>Add Tag</button>
        </div>

        <div>
          <label>Categories</label>
          {categoryFields.map((item, index) => (
            <div key={item.id}>
              <input {...register(`category.${index}`)} />
            </div>
          ))}
          <button type="button" onClick={() => appendCategory('')}>Add Category</button>
        </div>

        <div>
          <label>Questions</label>
          {questionFields.map((item, index) => (
            <div key={item.id}>
              <div>
                <label>Question</label>
                <input {...register(`questions.${index}.question`, { required: 'Question is required' })} />
              </div>
              <div>
                <label>Answer Options</label>
                {item.answerOptions.map((_, optIndex) => (
                  <div key={optIndex}>
                    <input {...register(`questions.${index}.answerOptions.${optIndex}`, { required: 'Answer option is required' })} />
                  </div>
                ))}
              </div>
              <div>
                <label>Correct Answer</label>
                <input {...register(`questions.${index}.correctAnswer`, { required: 'Correct answer is required' })} />
              </div>
              <button type="button" onClick={() => removeQuestion(index)}>Remove Question</button>
            </div>
          ))}
        </div>

        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
}

export default CreateAiQuiz;
