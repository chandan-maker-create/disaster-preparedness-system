import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

const fix = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const contents = await Content.find({});
    
    for (let content of contents) {
      let newCat = 'general';
      const title = content.title.toLowerCase();
      
      if (title.includes('earthquake')) newCat = 'earthquake';
      else if (title.includes('flood')) newCat = 'flood';
      else if (title.includes('fire')) newCat = 'fire';
      else if (title.includes('tsunami')) newCat = 'general';
      else if (title.includes('cyclone')) newCat = 'cyclone';
      
      // Update directly using native MongoDB driver
      await conn.connection.db.collection('contents').updateOne(
        { _id: content._id },
        { $set: { category: newCat } }
      );
      console.log(`Updated ${content.title} to ${newCat}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fix();
