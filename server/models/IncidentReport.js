import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['earthquake', 'flood', 'fire', 'cyclone', 'other'],
      required: true,
    },
    description: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved'],
      default: 'pending',
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);
export default IncidentReport;
