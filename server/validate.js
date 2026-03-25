import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const validate = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const contents = await conn.connection.db.collection('contents').find({}).toArray();
    const quizzes = await conn.connection.db.collection('quizzes').find({}).toArray();
    
    let allGood = true;
    for (let c of contents) {
      if (!c.category || c.category === 'undefined') {
        console.log(`ERROR: Content ${c.title} has invalid category: ${c.category}`);
        allGood = false;
      }
      
      const q = quizzes.find(quiz => quiz.contentId.toString() === c._id.toString());
      if (!q) {
        console.log(`ERROR: Content ${c.title} has NO QUIZ attached!`);
        allGood = false;
      } else if (q.questions.length !== 5) {
        console.log(`ERROR: Content ${c.title} has a quiz with ${q.questions.length} questions. Expected 5.`);
        allGood = false;
      }
    }
    
    if (contents.length === 0) {
      console.log("ERROR: No contents found.");
      allGood = false;
    }

    if (allGood) {
      console.log('SUCCESS: All contents have valid categories and 5-question quizzes attached correctly.');
    }
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

validate();
