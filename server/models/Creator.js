import mongoose from 'mongoose';

const socialChannelSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['youtube', 'instagram', 'tiktok', 'twitter']
  },
  handle: {
    type: String,
    required: true
  },
  followers: {
    type: Number,
    default: 0
  }
});

const experienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  description: {
    type: String,
    default: ''
  }
});

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date
  }
});

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  date: {
    type: Date
  }
});
const showcaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  }
});

const creatorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  coverBanner: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  primaryPlatform: {
    type: String,
    default: ''
  },
  experienceYears: {
    type: Number,
    default: 0
  },
  languages: {
    type: [String],
    default: []
  },
  availability: {
    type: String,
    default: 'Available'
  },
  instagramUrl: {
    type: String,
    default: ''
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  xUrl: {
    type: String,
    default: ''
  },
  facebookUrl: {
    type: String,
    default: ''
  },
  websiteUrl: {
    type: String,
    default: ''
  },
  followersCount: {
    type: Number,
    default: 0
  },
  avgEngagement: {
    type: Number,
    default: 0
  },
  avgReach: {
    type: Number,
    default: 0
  },
  monthlyViews: {
    type: Number,
    default: 0
  },
  showcase: {
    type: [showcaseSchema],
    default: []
  },
  niche: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ''
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  portfolioDescription: {
    type: String,
    default: ''
  },
  socialChannels: {
    type: [socialChannelSchema],
    default: []
  },
  experience: {
    type: [experienceSchema],
    default: []
  },
  achievements: {
    type: [achievementSchema],
    default: []
  },
  certificates: {
    type: [certificateSchema],
    default: []
  },
  videos: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Creator = mongoose.model('Creator', creatorSchema);
export default Creator;
