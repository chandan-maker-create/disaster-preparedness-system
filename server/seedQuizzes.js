import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding Quizzes');

    const contents = await Content.find({});
    console.log(`Found ${contents.length} contents.`);

    for (let content of contents) {
      const existingQuiz = await Quiz.findOne({ contentId: content._id });
      if (!existingQuiz) {
        console.log(`Adding quiz for content: ${content.title}`);
        
        let questions = [];
        if (content.category === 'earthquake') {
          questions = [
            {
              questionText: 'What is the most important thing to do during an earthquake if you are indoors?',
              options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Get near a window to see what is happening'],
              correctAnswerIndex: 1
            },
            {
              questionText: 'Which of these items should be in your emergency kit?',
              options: ['Video games', 'Flashlight and batteries', 'Ice cream', 'Heavy winter coats'],
              correctAnswerIndex: 1
            },
            {
              questionText: 'If you are driving when an earthquake starts, what should you do?',
              options: ['Speed up to get home faster', 'Pull over to a clear location and stay in the car', 'Get out and run', 'Stop under a bridge'],
              correctAnswerIndex: 1
            }
          ];
        } else if (content.category === 'flood') {
          questions = [
            {
              questionText: 'What does "Turn Around, Don\'t Drown" mean?',
              options: ['Always walk backwards near water', 'Do not attempt to walk or drive through flowing water', 'You can safely swim in floodwaters', 'Floodwaters are safe for vehicles but not pedestrians'],
              correctAnswerIndex: 1
            },
            {
              questionText: 'If a flood warning is issued, what is an immediate action you should take?',
              options: ['Move to higher ground immediately', 'Go to the basement', 'Wait until water enters your home before moving', 'Go outside to watch the water level'],
              correctAnswerIndex: 0
            }
          ];
        } else if (content.category === 'fire') {
          questions = [
            {
              questionText: 'What is the immediate action to take if your clothes catch fire?',
              options: ['Run fast to blow it out', 'Stop, Drop, and Roll', 'Yell for help without moving', 'Look for a fire extinguisher'],
              correctAnswerIndex: 1
            },
            {
              questionText: 'When escaping a building fire, how should you check if a door is safe to open?',
              options: ['Kick the door open', 'Use the back of your hand to feel the door or doorknob for heat', 'Look through the keyhole', 'Just open it quickly'],
              correctAnswerIndex: 1
            }
          ];
        } else {
          // generic
          questions = [
            {
              questionText: 'What is the primary purpose of an emergency family communication plan?',
              options: ['To decide who gets what food', 'To know how to contact one another and where to meet', 'To plan a vacation after the disaster', 'To memorize phone numbers of friends'],
              correctAnswerIndex: 1
            },
            {
              questionText: 'How much water per person per day is generally recommended for an emergency supply kit?',
              options: ['1 cup', '1 liter', '1 gallon', '5 gallons'],
              correctAnswerIndex: 2
            }
          ];
        }

        const newQuiz = new Quiz({
          contentId: content._id,
          title: `Quiz: ${content.title}`,
          questions
        });

        await newQuiz.save();
        console.log(`Successfully added quiz for ${content.title}`);
      } else {
        console.log(`Quiz already exists for content: ${content.title}`);
      }
    }

    console.log('Seeding quizzes completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
};

seedQuizzes();
