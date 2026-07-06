const Quiz = require('../models/quizs.model');
const User = require("../models/user.model");
const ApiError = require('../utils/apierror');
const ApiResponse = require('../utils/apiresponse');
const { GoogleGenAI } = require("@google/genai");
const { CreateQuizSchema, checkQuizSchema } = require('../utils/validation');

// Gemini client (reads GEMINI_API_KEY from .env automatically)
const ai = new GoogleGenAI({});

// ----------------- GET QUIZ -----------------
async function getQuiz(req, res) {
  try {
    console.log("Fetching quizzes...");
    const quizes = await Quiz.find().select("-questions.correctAnswer");
    console.log("Quizzes retrieved:", quizes);

    if (quizes.length === 0) {
      throw new ApiError(400, "No Quiz Found");
    }

    return res.status(200).send(new ApiResponse(200, quizes, "Got quizzes!"));
  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).send({ message: error.message });
    }

    return res.status(500).send({ message: "Internal Server Error" });
  }
}

// ----------------- CREATE QUIZ -----------------
async function createQuiz(req, res) {
  try {
    console.log(req.body);
    console.log("coming here");
    const validatedField = CreateQuizSchema.safeParse(req.body);
    if (!validatedField.success) {
      console.log("Validation failed:", validatedField.error);
      console.log(validatedField.error);
      throw new ApiError(400, "Invalid Credential");
    }
    console.log(validatedField.data);

    const quiz = await Quiz.create({
      ...validatedField.data,
    });

    return res.status(201).send({ message: "quiz created!", quiz });
  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).send({ message: error.message });
    }

    return res.status(500).send({ message: "Internal Server Error" });
  }
}

// ----------------- CHECK QUIZ -----------------
async function checkQuiz(req, res) {
  try {
    const userId = req.userId;
    const validatedField = checkQuizSchema.safeParse(req.body);
    if (!validatedField.success) {
      console.log(validatedField.error);
      throw new ApiError(400, "Invalid Credential");
    }
    const { answer, quizId } = validatedField.data;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(400).send({ message: "No quiz found" });
    }

    let score = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === quiz.questions[i].correctAnswer) {
        score++;
      }
    }

    const user = await User.findById(userId);
    user.totalScore += score;
    user.quizesTaken.push({ quiz, score: score });

    await user.save();

    return res.status(200).send({ score, message: "Successfully Submitted" });
  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).send({ message: error.message });
    }

    return res.status(500).send({ message: "Internal Server Error" });
  }
}

// ----------------- GENERATE QUIZ (GEMINI) -----------------
async function generateQuiz(req, res) {
  try {
    const { prompt } = req.body;
    console.log("here are we (Gemini GenAI)");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a quiz JSON with this exact schema:
{
  "title": "string",
  "description": "string",
  "questions": [
    {
      "question": "string",
      "answerOptions": ["string"],
      "correctAnswer": "string",
      "marks": number
    }
  ]
}
Topic: ${prompt}`,
    });

    // Clean Gemini output (remove ```json wrappers)
    let text = response.text || "{}";
    text = text.replace(/^\s*```(?:json)?\s*/, "")
               .replace(/\s*```\s*$/, "")
               .trim();

    let rawQuiz;
    try {
      rawQuiz = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON from Gemini:", text);
      return res.status(500).json({ error: "Model returned invalid JSON" });
    }

    // In case Gemini still uses "options" + "answer" keys, map them:
    const transformedQuiz = {
      title: rawQuiz.title,
      description: rawQuiz.description,
      questions: rawQuiz.questions.map((q) => ({
        question: q.question,
        answerOptions: q.answerOptions || q.options, // handle either
        correctAnswer: q.correctAnswer || q.answer,
        marks: q.marks || 1,
      })),
    };

    res.json(transformedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
}

// ----------------- EXPORTS -----------------
module.exports = {
  getQuiz,
  createQuiz,
  checkQuiz,
  generateQuiz,
};
