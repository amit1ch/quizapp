require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRouter = require('./routes/user');
const quizRouter = require('./routes/quiz.route'); // <— CommonJS require
const connectDB = require('./db/connect');



const app = express();

// 1️⃣ CORS setup for local frontend
const allowedOrigins = [
  'http://localhost:3001', // your frontend URL
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Block other origins
    return callback(null, false);
  },
  credentials: true
}));

// 2️⃣ Handle preflight requests
app.options('*', cors());

// 3️⃣ Middleware
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true })); // parse form data if needed


// 4️⃣ Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/quiz', quizRouter); // <-- your quiz routes (including /generate)

// 5️⃣ Serve React build (optional, if you have client/build)
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (_, res) =>
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
);

// 6️⃣ Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

start();
