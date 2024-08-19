const express = require('express');
const router = express.Router();
const {getQuiz,createQuiz,checkQuiz} = require('../controller/quiz.controller'); // Importing the function from quiz.controller.js
const {authorizeUser} = require('../middleware/user.middleware');

router.route("/all-quizes").get(authorizeUser, getQuiz);
router.route("/add-quiz").post(authorizeUser,createQuiz);
router.route("/check-quiz").post(authorizeUser,checkQuiz);

module.exports = router;

