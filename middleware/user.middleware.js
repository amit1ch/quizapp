const ApiError = require('../utils/apierror');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authorizeUser(req, res, next) {
  console.log("authorizeUser hit"); // <-- debug log
  console.log("Cookies:", req.cookies); // <-- debug log
  try {
    // Extract token from cookie or Authorization header
    // const token =
    //   req.cookies?.accessToken ||
    //   req.header("Authorization")?.replace("Bearer ", "");

      console.log("Cookies:", req.cookies);
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      console.log("Token:", token);

    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.user_id) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = await User.findById(payload.user_id);
    if (!user) return res.status(401).send({ message: "User not found" });

    req.userId = user._id;
    next();
  } catch (error) {
    console.error("authorizeUser error:", error);
    if (error instanceof ApiError) {
      return res.status(401).send({ message: "Unauthorized user" });
    }
    return res.status(500).send({ message: "Internal Server Error" });
  }
}

async function checkRole(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (user?.role === 'admin') return next();
    return res.status(403).send({ message: "Access Denied" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}

module.exports = { authorizeUser, checkRole };
