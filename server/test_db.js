import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = 'mongodb+srv://nathchandan5009_db_user:chandanHero@cluster0.vcpwlka.mongodb.net/disaster-edu?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name));
      
      for (const col of collections) {
         const count = await mongoose.connection.db.collection(col.name).countDocuments();
         console.log(`Collection ${col.name} has ${count} documents`);
      }
      
      process.exit(0);
    } catch (e) {
      console.error('Error:', e);
      process.exit(1);
    }
  })
  .catch(e => {
    console.error('DB connect error:', e.message);
    process.exit(1);
  });
