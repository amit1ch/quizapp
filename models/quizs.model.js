const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    description: {
        type: String,  
        required:true,
    },
    tag: {
        type: [String],  
        required: true
    },
    level: {
        type: String,  
        required: true,
    },
    category:{
        type:[String],
        required:true,
    },

    questions:
    [
        {

        question:String,
        answerOptions:[String],
        correctAnswer:String,
        marks:Number,

    }],
   
});

 
module.exports = mongoose.model("Quiz", QuizSchema);
