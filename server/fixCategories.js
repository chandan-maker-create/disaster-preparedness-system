import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

const fixCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Category Fix');

    const contents = await Content.find({});
    let updatedCount = 0;

    for (let content of contents) {
      if (!content.category) {
        let newCat = 'general';
        const title = content.title.toLowerCase();
        
        if (title.includes('earthquake')) newCat = 'earthquake';
        else if (title.includes('flood')) newCat = 'flood';
        else if (title.includes('fire')) newCat = 'fire';
        else if (title.includes('tsunami')) newCat = 'general';
        else if (title.includes('cyclone')) newCat = 'cyclone';
        
        await Content.updateOne({ _id: content._id }, { $set: { category: newCat } });
        console.log(`Updated "${content.title}" to category: ${newCat}`);
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} contents.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing categories:', error);
    process.exit(1);
  }
};

fixCategories();
