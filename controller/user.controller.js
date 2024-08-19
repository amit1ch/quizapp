const User = require('../models/user.model');
const ApiError = require('../utils/apierror');
const ApiResponse = require('../utils/apiresponse');
const {RegisterUserSchema,loginUserSchema} = require('../utils/validation');
const {hassPassword,comparePassword,generateToken} = require('../utils/index');

  async function registerUser(req,res){
    try{
      
     
  const userData = req.body;

     const validatedfield = RegisterUserSchema.safeParse(req.body);
    if(!validatedfield.success) throw new ApiError(400,"Invalid Credinetial");
    
    const {username,name,email,password,confirmpassword} = validatedfield.data;
    console.log(validatedfield.data)

  if(password!==confirmpassword){
    throw new ApiError(400,"password do not match");
  }

  // email already exist or not
   
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(409).json(new ApiError(409,"email already exist!"))
    }
    //changing the password in hassformate
    const hashedpassword =await hassPassword(password);
    
  const user = await User.create({
    username,
    name,
    email,
    password: hashedpassword,
    

  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
}catch (error) {
        console.error("Error occurred:", error);

        if (error instanceof ApiError) {
          console.log('ApiError detected:', error);
          return res.status(error.statusCode).send({ message: error.message });
      }
        
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

async function loginUser(req,res){
  
  try{
    const validatedFields = loginUserSchema.safeParse(req.body);
    if(!validatedFields.success){
      throw new ApiError(400,"Invalid credentials");
    }

    const {email,password} = validatedFields.data;
    const findUser = await User.findOne({email});
    if(!findUser){
      throw new ApiError("Invalid Credentials")
    }

    const isPasswordCorrect = comparePassword(password,findUser.password);

    if(!isPasswordCorrect){
      throw new ApiError("Invalid Credentials");
    }
    // generate access token
    const accessToken = generateToken({user_id:findUser._id});
    
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax' 
    };
    
    return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .send({message:"successfully logged in!" ,accessToken,user:findUser});

  }catch (error) {
    console.error("Error occurred:", error);


    if (error instanceof ApiError) {
        return res.status(error.statusCode).send({ message: error.message });
    }
    
    return res.status(500).send({ message: "Internal Server Error" });
}
}



//getting current user details

async function getCurrentUser(req,res){
  const userId = req.userId;
  const user = await User.findById(userId).select("-password");
  console.log(user);
  res.status(200).send(user);

}
   
   async function logOut(req,res){
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
      sameSite: 'lax' 
    };
    

  res
    .status(203)
    .clearCookie("accessToken", options)
    .send({ message: "logged out!" ,statusCode:203 });
  }

module.exports = {registerUser,loginUser ,getCurrentUser,logOut};