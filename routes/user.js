const express = require('express')
const router = express.Router();
const {registerUser,loginUser,getCurrentUser,logOut} = require('../controller/user.controller');
const {authorizeUser,checkRole} = require('../middleware/user.middleware');
 
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/quiz").post(authorizeUser,checkRole);
router.route("/profile").get(authorizeUser,getCurrentUser);
 router.route("/logout").get(authorizeUser,logOut);

// router.get("/logout", (req, res) => {
//     console.log("Logout route hit");
//     res.send("Logout route hit");
//   });


module.exports = router;