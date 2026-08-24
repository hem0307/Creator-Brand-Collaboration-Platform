import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  pitch: {
    type: String,
    required: [true, 'Please provide your application pitch']
  },
  proposedRate: {
    type: Number,
    required: [true, 'Please specify your proposed rate']
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Ensure a creator cannot apply multiple times to the same project
applicationSchema.index({ projectId: 1, creatorId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
