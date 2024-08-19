import React from 'react';
import { useForm, useFieldArray} from 'react-hook-form';
import './Quizform.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function CreateQuiz() {

  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      tag: [''],
      level: '',
      category: [''],
      numberOfQuestion: 0,
      questions: [{ question: '', answerOptions: ['', '', '', ''], correctAnswer: '', marks: 1 }],
    }
  });

  const { fields: tagFields, append: appendTag } = useFieldArray({ control, name: 'tag' });
  const { fields: categoryFields, append: appendCategory } = useFieldArray({ control, name: 'category' });
  const { fields: questionFields, append: appendQuestion } = useFieldArray({ control, name: 'questions' });

  const onSubmit = async (data) => {

    const response = await axios.post("http://localhost:3000/api/v1/quiz/add-quiz",data,{withCredentials:true})
    console.log(response?.data);

    navigate('/dashboard');
    
};

  return (
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
        <label>Level</label>
        <input {...register('level', { required: 'Level is required' })} />
        {errors.level && <p>{errors.level.message}</p>}
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
             
          </div>
        ))}
        
        <button type="button" onClick={() => appendQuestion({ question: '', answerOptions: ['', '', '', ''], correctAnswer: '', marks: 0 })}>
          Add Question
        </button>
      </div>

      <button type="submit"> Submit Quiz</button>
    </form>
  );
}

export default CreateQuiz;
