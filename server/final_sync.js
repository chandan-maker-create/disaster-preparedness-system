import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await Quiz.deleteMany({});
    console.log('Quizzes deleted.');

    const contents = await Content.find({});
    let count = 0;

    for (let c of contents) {
      const cat = c.category || 'general';
      let questions = [];
      
      if (cat === 'earthquake') {
        questions = [
          { questionText: 'What is the most important thing to do during an earthquake if you are indoors?', options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Get near a window'], correctAnswerIndex: 1 }
        ];
      } else if (cat === 'flood') {
        questions = [
          { questionText: 'What does "Turn Around, Don\'t Drown" mean?', options: ['Always walk backwards near water', 'Do not attempt to walk or drive through flowing water', 'You can safely swim in floodwaters', 'Floodwaters are safe'], correctAnswerIndex: 1 }
        ];
      } else if (cat === 'fire') {
        questions = [
          { questionText: 'What is the immediate action to take if your clothes catch fire?', options: ['Run fast to blow it out', 'Stop, Drop, and Roll', 'Yell for help without moving', 'Look for a fire extinguisher'], correctAnswerIndex: 1 }
        ];
      } else if (cat === 'cyclone') {
        questions = [
          { questionText: 'When is it safe to go outside during a cyclone?', options: ['During the eye of the storm when it gets calm', 'When the winds seem to die down', 'Only when authorities declare it is safe', 'When you need to check on your car'], correctAnswerIndex: 2 }
        ];
      } else {
        questions = [
          { questionText: 'What is the primary purpose of an emergency family communication plan?', options: ['To decide who gets what food', 'To know how to contact one another and where to meet', 'To plan a vacation after the disaster', 'To memorize phone numbers'], correctAnswerIndex: 1 }
        ];
      }

      await Quiz.create({
        contentId: c._id,
        title: `Quiz: ${c.title}`,
        questions
      });
      count++;
      console.log(`Created Quiz for ${c.title} (ID: ${c._id})`);
    }

    const verify = await Quiz.find();
    console.log(`Verification: ${verify.length} quizzes in DB.`);
    if (verify.length > 0) {
      console.log(`First Quiz ContentId: ${verify[0].contentId}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
