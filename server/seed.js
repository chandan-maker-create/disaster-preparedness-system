import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing users just in case
    await User.deleteMany();

    const users = [
      {
        name: 'Admin User',
        email: 'admin@system.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Student User',
        email: 'student@school.com',
        password: 'password123',
        role: 'student'
      }
    ];

    for (const user of users) {
      await User.create(user);
    }

    console.log('Database seeded with admin and student users!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
