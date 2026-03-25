import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/Quiz.js';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const q = await Quiz.find();
  console.log(`Total quizzes: ${q.length}`);
  process.exit(0);
};
check();
