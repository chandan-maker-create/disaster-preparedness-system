import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const fixQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Fixing Quizzes');

    // Delete all current quizzes to start fresh
    await Quiz.deleteMany({});
    console.log('Cleared old quizzes');

    const contents = await Content.find({});
    let qCount = 0;

    for (let content of contents) {
      let questions = [];
      const cat = content.category || '';
      
      if (cat === 'earthquake') {
        questions = [
          { questionText: 'What is the most important thing to do during an earthquake if you are indoors?', options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Get near a window'], correctAnswerIndex: 1 },
          { questionText: 'Which of these items should be in your emergency kit?', options: ['Video games', 'Flashlight and batteries', 'Ice cream', 'Heavy winter coats'], correctAnswerIndex: 1 }
        ];
      } else if (cat === 'flood') {
        questions = [
          { questionText: 'What does "Turn Around, Don\'t Drown" mean?', options: ['Always walk backwards near water', 'Do not attempt to walk or drive through flowing water', 'You can safely swim in floodwaters', 'Floodwaters are safe'], correctAnswerIndex: 1 },
          { questionText: 'If a flood warning is issued, what is an immediate action you should take?', options: ['Move to higher ground immediately', 'Go to the basement', 'Wait until water enters your home', 'Go outside to watch'], correctAnswerIndex: 0 }
        ];
      } else if (cat === 'fire') {
        questions = [
          { questionText: 'What is the immediate action to take if your clothes catch fire?', options: ['Run fast to blow it out', 'Stop, Drop, and Roll', 'Yell for help without moving', 'Look for a fire extinguisher'], correctAnswerIndex: 1 },
          { questionText: 'When escaping a building fire, how should you check if a door is safe to open?', options: ['Kick the door open', 'Use the back of your hand to feel the door for heat', 'Look through the keyhole', 'Just open it quickly'], correctAnswerIndex: 1 }
        ];
      } else if (cat === 'cyclone') {
        questions = [
          { questionText: 'When is it safe to go outside during a cyclone?', options: ['During the eye of the storm when it gets calm', 'When the winds seem to die down', 'Only when authorities declare it is safe', 'When you need to check on your car'], correctAnswerIndex: 2 },
          { questionText: 'Which of the following is NOT a recommended preparation for a cyclone?', options: ['Gathering emergency supplies', 'Opening all windows to let the pressure equalize', 'Identifying shelter locations', 'Knowing your area\'s risk'], correctAnswerIndex: 1 }
        ];
      } else {
        questions = [
          { questionText: 'What is the primary purpose of an emergency family communication plan?', options: ['To decide who gets what food', 'To know how to contact one another and where to meet', 'To plan a vacation after the disaster', 'To memorize phone numbers'], correctAnswerIndex: 1 },
          { questionText: 'How much water per person per day is generally recommended for an emergency supply kit?', options: ['1 cup', '1 liter', '1 gallon', '5 gallons'], correctAnswerIndex: 2 }
        ];
      }

      await Quiz.create({
        contentId: content._id,
        title: `Quiz: ${content.title}`,
        questions
      });
      qCount++;
    }

    console.log(`Successfully added ${qCount} quizzes.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing quizzes:', error);
    process.exit(1);
  }
};

fixQuizzes();
