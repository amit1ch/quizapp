const express = require('express');
const router = express.Router();

const {
  getQuiz,
  createQuiz,
  checkQuiz,
  generateQuiz
} = require('../controller/quiz.controller');

const { authorizeUser } = require('../middleware/user.middleware');

// Routes
router.post('/add-quiz',  (req, res, next) => {
    console.log("Route hit /add-quiz");
    console.log("Body:", req.body);
    next(); // Pass to createQuiz
  }, createQuiz);
  
// router.post('/add-quiz', (req, res) => {
//   console.log("✅ HIT");
//   createQuiz(req, res);
// });
// router.post('/add-quiz',  createQuiz); // <-- fixed
// router.post('/add-quiz', console.log("works fine"));
router.post('/check-quiz', authorizeUser, checkQuiz);
router.post('/generate', generateQuiz);
router.get('/all-quizes', authorizeUser, getQuiz);

module.exports = router;
