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

async function loginUser(req, res) {
  try {
    console.log("Login request body:", req.body);

    const validatedFields = loginUserSchema.safeParse(req.body);
    console.log("Validated fields:", validatedFields);

    if (!validatedFields.success) {
      throw new ApiError(400, "Invalid credentials");
    }

    const { email, password } = validatedFields.data;

    const findUser = await User.findOne({ email }).select('+password'); // make sure password is selected
    console.log("Found user:", findUser);

    if (!findUser) {
      throw new ApiError(401, "Invalid Credentials");
    }

    const isPasswordCorrect = await comparePassword(password, findUser.password);
    console.log("Password correct?", isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid Credentials");
    }

    const accessToken = generateToken({ user_id: findUser._id });
    console.log("Access token generated:", accessToken);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 // 1 hour cookie
    };

    const user = await User.findById(findUser._id).select("-password -refreshToken");
    console.log("User to return:", user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ message: "Login successful", accessToken, user });

  } catch (error) {
    console.error("Login error caught:", error);
    console.error("Error name:", error.name);

    // use .name instead of instanceof to avoid module resolution issues
    if (error.name === 'ApiError') {
      console.log('ApiError detected:', error);
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}






//getting current user details

async function getCurrentUser(req,res){
  const userId = req.userId;
  const user = await User.findById(userId).select("-password");
  console.log(user);
  res.status(200).send(user);

}
   
  //  async function logOut(req,res){
  //   const options = {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
  //     sameSite: 'lax' 
  //   };
    

  // res
  //   .status(203)
  //   .clearCookie("accessToken", options)
  //   .send({ message: "logged out!" ,statusCode:203 });
  // }


  async function logOut(req, res) {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };
  
    return res
      .clearCookie("accessToken", options)
      .status(200)
      .json({
        message: "Logged out successfully",
      });
  }
  

module.exports = {registerUser,loginUser ,getCurrentUser,logOut};