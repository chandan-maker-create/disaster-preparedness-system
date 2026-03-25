import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const contents = await Content.find();
  console.log('Total content:', contents.length);
  contents.forEach(c => console.log(`- ${c.title} (${c.category})`));
  process.exit(0);
};

check();
