require("dotenv").config();
const cookieParser = require('cookie-parser');
const express = require('express');
const userRouter = require("./routes/user")
const connectDB = require("./db/connect")
const cors = require("cors");
const quizRouter = require('./routes/quiz.route');
const path = require("path");

const app = express();

app.use(cors({
    origin:"http://localhost:3001",
    credentials:true,

}))

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user",userRouter)
app.use("/api/v1/quiz",quizRouter);
app.use(express.static(path.join(__dirname,"/client/build")))

app.get("*",(_,res)=>res.sendFile(path.join(__dirname,"/client/build/index.html")))


 const start  = async()=>{
    try{
        await connectDB();
        app.listen(3000,()=>{
            console.log(`${3000} yes i am connected`)
        })
    }catch(error){
        console.log(error,console.log(error));

    }
 }

start();
