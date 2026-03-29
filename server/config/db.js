import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI is not defined in the .env file!');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4 // Forcing IPv4 to prevent common Atlas DNS resolution timeouts
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('\n--- IMPORTANT FIX ---');
    console.error("If you see a 'Could not connect to any servers' error, your computer's IP address is definitely being blocked by MongoDB Atlas.");
    console.error('Please log into MongoDB Atlas -> Security -> Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0)');
    console.error('---------------------\n');
    process.exit(1);
  }
};

export default connectDB;
