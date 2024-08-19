import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import './App.css';
import SignUp from './Components/SignUp/SignUp';
import DashNavbar from './Components/DashNavbar/DashNavbar';
import Dashboard from './Components/Dashboard/Dashboard';
import Quiz from './Components/Quiz/Quiz';
import Stats from './Components/States/States';
import CreateQuiz from './Components/Quizform/Quizform';
import Landing from './Components/Landing/Landing';

import {AuthContext} from './Components/AuthContext/AuthContext';

import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';

function App() {
   


  return (

  <AuthContext> 
    <BrowserRouter>
    <Routes>
    
      <Route element={<PublicRoute/>}>
       <Route path="/" element={<Landing />} />
       <Route path="/login" element={<Login />} />
       <Route path = "/signUp" element ={<SignUp/>}/>
      </Route>
      <Route element =  {<ProtectedRoute/>} > 
       <Route path ="/dashboard" element = {<Dashboard/>}/>
       <Route path='/questions' element = {<Quiz/>} />
       <Route path = "/dashnavbar" element = {<DashNavbar/>}/>
       <Route path='/stats' element = {<Stats/>}/>
       <Route path ='/create-quiz-form' element = {<CreateQuiz/>}/>
    </Route>
    </Routes>
  </BrowserRouter>
</AuthContext>
  );
}
 

export default App;
