import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const eq = await Content.findOne({ title: /Earthquake/i });
  console.log('Earthquake Content ID:', eq._id);
  
  const quizzes = await Quiz.find({ contentId: eq._id });
  console.log('Quizzes found with that ID:', quizzes.length);
  
  const allQuizzes = await Quiz.find();
  console.log('Total Quizzes in DB:', allQuizzes.length);
  if(allQuizzes.length > 0) {
    console.log('First quiz contentId:', allQuizzes[0].contentId);
    console.log('First quiz contentId type:', typeof allQuizzes[0].contentId);
  }
  
  process.exit(0);
};

check();
