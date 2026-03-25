import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const earthquake = await Content.findOne({ title: /Earthquake/i });
  console.log(`Earthquake module id: ${earthquake._id}`);
  const q = await Quiz.find({ contentId: earthquake._id });
  console.log(`Quizzes for Earthquake: ${q.length}`);
  if(q.length > 0) console.log(`Quiz title: ${q[0].title}, questions: ${q[0].questions.length}`);
  process.exit(0);
};
check();
