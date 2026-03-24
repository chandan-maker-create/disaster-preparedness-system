import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    category: {
      type: String,
      enum: ['earthquake', 'flood', 'fire', 'cyclone', 'general'],
      default: 'general',
    },
    location: { type: String }, // Optional specific location
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
