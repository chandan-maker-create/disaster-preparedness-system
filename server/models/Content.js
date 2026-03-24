import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['earthquake', 'flood', 'fire', 'cyclone', 'general'],
      required: true,
    },
    description: { type: String },
    text: { type: String, required: true },
    videoUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
