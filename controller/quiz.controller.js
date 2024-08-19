
const Quiz = require('../models/quizs.model');
const User = require("../models/user.model")
const ApiError = require('../utils/apierror');
const ApiResponse = require('../utils/apiresponse');
const { CreateQuizSchema ,checkQuizSchema } = require('../utils/validation');
 
async function getQuiz(req, res) {
    try {
        console.log("Fetching quizzes...");
        const quizes = await Quiz.find().select("-questions.correctAnswer");
        console.log("Quizzes retrieved:", quizes);

        if (quizes.length === 0) {
            throw new ApiError(400, "No Quiz Found");
        }


        return res.status(200).send( new ApiResponse(200, quizes,"Got quizzes!"));
    } catch (error) {
        console.error("Error occurred:", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).send({ message: error.message });
        }
        
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

 async function createQuiz(req,res){
   try{
    console.log(req.body);
     const validatedField = CreateQuizSchema.safeParse(req.body);
     if(!validatedField.success) {
        console.log(validatedField.error);
        throw new ApiError(400,"Invalid Credinetial");
    }
        console.log(validatedField.data);

        

        const quiz = await Quiz.create({
            ...validatedField.data,


          });
          
            return res.status(201).send({ message: "quiz created!", quiz });
         
        }catch (error) {
            console.error("Error occurred:", error);
    
            if (error instanceof ApiError) {
                return res.status(error.statusCode).send({ message: error.message });
            }
            
            return res.status(500).send({ message: "Internal Server Error" });
        }
 }

 async function checkQuiz(req,res){
    try {

        const userId = req.userId;
        const validatedField = checkQuizSchema.safeParse(req.body);
        if(!validatedField.success) {
            console.log(validatedField.error);
            throw new ApiError(400,"Invalid Credinetial");
        }
        const {answer,quizId} = validatedField.data;
        const quiz = await Quiz.findById(quizId);
         
        if(!quiz){
            return res.status(400).send({message:"No quiz find"});

        }
        let score = 0;
        

        for(let i = 0;i<answer.length;i++){
            if(answer[i]===quiz.questions[i].correctAnswer){
                score++;
            }
            
        }


        const user = await User.findById(userId);
        user.totalScore+=score;
        user.quizesTaken.push({quiz,score:score})
        
        await user.save();

        return res.status(200).send({score,message:"Successfully Submitted"});





    } catch (error) {
        console.error("Error occurred:", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).send({ message: error.message });
        }
        
        return res.status(500).send({ message: "Internal Server Error" });
    }
 }
//quiz by filterat
 



module.exports = {getQuiz,createQuiz,checkQuiz};
