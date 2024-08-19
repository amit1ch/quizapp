const ApiError = require('../utils/apierror');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');


 async function authorizeUser(req,res,next){

    try{

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        const payload = jwt.verify(token, process.env.JWT_SECRET) ;

        if(!payload ||!payload.user_id){
            throw new ApiError(401,"Invalid Token");

        }

        
        const user  = await User.findById(payload.user_id);
        if(!user) throw new ApiError(401,"User not found");

        req.userId = user._id;
        
        console.log("is toke")

        next();
    
    }
    catch(error){
        if(error instanceof ApiError){
            res.status(401).send({message:"Unathorized user"});
        }
        res.status(500).send({message:"Internal Server Error"});
    }
}


async function checkRole(req, res, next) {
    console.log("role")
    try {
        const userId = req.userId;
        console.log(userId);
        const user = await User.findById(userId);
        console.log(user);

        if (user.role === 'admin') {
            console.log("yes you can go");
            return next();   
        }

        throw new ApiError(409, "Access Denied");

    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(409).send({ message: "Access Denied" });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = {authorizeUser,checkRole};