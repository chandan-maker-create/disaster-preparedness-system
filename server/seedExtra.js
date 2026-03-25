import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';
import Quiz from './models/Quiz.js';
import User from './models/User.js';

dotenv.config();

const seedExtra = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Extra Content Seeding');

    // Get an admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne(); // just get any user if no admin
    }
    if (!admin) {
      console.log('No users found in database. Cannot create content.');
      process.exit(1);
    }

    const newContents = [
      {
        title: 'Cyclone Preparedness',
        category: 'cyclone',
        description: 'Learn how to prepare your home and family for severe cyclones and hurricanes.',
        text: 'Cyclones (also known as hurricanes or typhoons) are massive storm systems that form over warm ocean waters and move toward land. Potential threats from cyclones include powerful winds, heavy rainfall, storm surges, coastal and inland flooding, rip currents, tornadoes, and landslides. \n\nBefore a cyclone:\n1. Know your area\'s risk.\n2. Sign up for your community\'s warning system.\n3. Identify shelter locations.\n4. Gather emergency supplies, including food, water, protective clothing, medications, batteries, and flashlights.\n\nDuring a cyclone:\n1. Stay indoors and away from windows and glass doors.\n2. Never go outside during the calm "eye" of the storm.\n\nAfter a cyclone:\n1. Listen to local authorities for information and special instructions.\n2. Do not touch loose or dangling power lines.',
        videoUrl: 'https://www.youtube.com/watch?v=LLbX-PuvjV8',
        createdBy: admin._id
      },
      {
        title: 'General Evacuation Guidelines',
        category: 'general',
        description: 'Understand the standard procedures for evacuating safely during any disaster.',
        text: 'Evacuations are more common than many people realize. Fires and floods cause evacuations most frequently across the globe. When community evacuations become necessary, local officials provide information to the public through the media. \n\n1. Download the FEMA app or other local emergency apps.\n2. Always follow the instructions of local officials and remember that your evacuation route may be on foot depending on the type of disaster.\n3. Before leaving, secure your home by closing and locking doors and windows.\n4. Unplug electrical equipment such as radios, televisions, and small appliances.\n5. Leave early enough to avoid being trapped by severe weather.',
        videoUrl: 'https://www.youtube.com/watch?v=e_kax5E0Xhc',
        createdBy: admin._id
      }
    ];

    for (let currentContent of newContents) {
      const exists = await Content.findOne({ title: currentContent.title });
      if (!exists) {
        const created = await Content.create(currentContent);
        console.log(`Created content: ${created.title}`);

        // Create quiz for it
        let questions = [];
        if (created.category === 'cyclone') {
          questions = [
            {
              questionText: 'When is it safe to go outside during a cyclone?',
              options: ['During the eye of the storm when it gets calm', 'When the winds seem to die down', 'Only when authorities declare it is safe', 'When you need to check on your car'],
              correctAnswerIndex: 2
            },
            {
              questionText: 'Which of the following is NOT a recommended preparation for a cyclone?',
              options: ['Gathering emergency supplies', 'Opening all windows to let the pressure equalize', 'Identifying shelter locations', 'Knowing your area\'s risk'],
              correctAnswerIndex: 1
            }
          ];
        } else {
          questions = [
            {
              questionText: 'What should you do with electrical equipment before evacuating?',
              options: ['Leave them on', 'Unplug them', 'Put them in water', 'Take them all with you'],
              correctAnswerIndex: 1
            },
            {
              questionText: 'If you are told to evacuate by authorities, what should you do?',
              options: ['Wait an hour to see if it\'s really bad', 'Leave immediately and follow instructions', 'Call the police to confirm', 'Go to the roof'],
              correctAnswerIndex: 1
            }
          ];
        }

        const newQuiz = new Quiz({
          contentId: created._id,
          title: `Quiz: ${created.title}`,
          questions
        });
        await newQuiz.save();
        console.log(`Created quiz for: ${created.title}`);
      } else {
        console.log(`Content already exists: ${currentContent.title}`);
      }
    }

    console.log('Extra content seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding extra content:', error);
    process.exit(1);
  }
};

seedExtra();
