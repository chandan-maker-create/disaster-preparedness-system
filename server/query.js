import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const contents = await Content.find({});
  console.log(JSON.stringify(contents, null, 2));
  process.exit(0);
});
