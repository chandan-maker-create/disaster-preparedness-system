import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';
import fs from 'fs';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const eq = await Content.findOne({ title: /Earthquake/i });
  
  const quizzes = await Quiz.find({ contentId: eq._id });
  
  const allQuizzes = await Quiz.find();
  
  const result = {
    eqId: eq._id,
    quizzesLength: quizzes.length,
    totalQuizzes: allQuizzes.length,
    firstQuizId: allQuizzes.length > 0 ? allQuizzes[0].contentId : null,
    match: allQuizzes.length > 0 && allQuizzes[0].contentId.toString() === eq._id.toString()
  };
  fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
  process.exit(0);
};

check();
