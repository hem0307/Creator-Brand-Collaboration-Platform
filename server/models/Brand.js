import mongoose from 'mongoose';

const brandSocialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['instagram', 'twitter', 'linkedin', 'facebook']
  },
  handle: {
    type: String,
    required: true
  }
});

const brandSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  companyName: {
    type: String,
    required: [true, 'Please provide a company name']
  },
  industry: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  socialLinks: {
    type: [brandSocialLinkSchema],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  // Extended fields for Company Profile requirements
  companyLogo: {
    type: String,
    default: ''
  },
  coverBanner: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  productsServices: {
    type: String,
    default: ''
  },
  mission: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  instagramUrl: {
    type: String,
    default: ''
  },
  facebookUrl: {
    type: String,
    default: ''
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  twitterUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
