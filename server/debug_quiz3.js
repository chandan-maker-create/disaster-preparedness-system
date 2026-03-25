import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';
import fs from 'fs';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const contents = await Content.find({});
  const quizzes = await Quiz.find({});
  
  const result = {
    contents: contents.map(c => ({ id: c._id.toString(), title: c.title })),
    quizzes: quizzes.map(q => ({ id: q._id.toString(), contentId: q.contentId ? q.contentId.toString() : null, title: q.title }))
  };
  fs.writeFileSync('debug3.json', JSON.stringify(result, null, 2));
  process.exit(0);
};

check();
