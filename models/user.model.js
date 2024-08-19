const mongoose = require("mongoose");

const UserRegistrationSchema = new mongoose.Schema({
    username: {
        type: String,  
        required: true,
        unique: true,
    },
    email: {
        type: String,  
        required: true,
        unique: true,
    },
    name: {
        type: String,  
        required: true,
    },
    password: {
        type: String,  
        required: true,
    },
    accessToken:{
        type:String,
        
    },
    
    role:{
         type:String,
         enum:["user" , "admin"],
         required:true,
         default:"user"
    },
    quizesCreated:[{ type : mongoose.Schema.Types.ObjectId , ref : "Quiz" }],
    
    quizesTaken:[{
    
        quiz:{ type:mongoose.Schema.Types.ObjectId,ref:"Quiz"},
        score:{
            type: Number,
            default:0,
            required:true,
        }
    }],

totalScore:{
    type:Number,
    default:0,
}

},
{
    timestamps:true
}

);

 
module.exports = mongoose.model("User", UserRegistrationSchema);
