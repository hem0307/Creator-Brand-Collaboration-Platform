import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a project title']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project brief or description']
  },
  deliverables: {
    type: [String],
    required: [true, 'Please provide at least one deliverable']
  },
  niche: {
    type: [String],
    required: [true, 'Please specify niches']
  },
  targetPlatforms: {
    type: [String],
    required: [true, 'Please specify platform requirements']
  },
  budget: {
    min: {
      type: Number,
      required: [true, 'Please provide minimum budget']
    },
    max: {
      type: Number,
      required: [true, 'Please provide maximum budget']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'active'
  },
  creatorsRequired: {
    type: Number,
    default: 1
  },
  deadline: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  location: {
    type: String,
    default: 'Global'
  },
  requirements: {
    type: [String],
    default: []
  },
  isRemote: {
    type: Boolean,
    default: true
  },
  // Extended fields for Campaign Management
  productName: {
    type: String,
    default: ''
  },
  paymentPerCreator: {
    type: Number,
    default: 0
  },
  minFollowers: {
    type: Number,
    default: 0
  },
  minEngagementRate: {
    type: Number,
    default: 0
  },
  preferredCreatorCategory: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: ''
  },
  appDeadline: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  submissionDeadline: {
    type: Date
  },
  productImages: {
    type: [String],
    default: []
  },
  brandGuidelines: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
