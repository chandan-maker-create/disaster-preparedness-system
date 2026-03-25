import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const check = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const contents = await conn.connection.db.collection('contents').find({}).toArray();
    console.log(JSON.stringify(contents, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

check();
