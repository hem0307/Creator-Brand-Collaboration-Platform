import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please write your review comment']
  }
}, {
  timestamps: true
});

// Avoid duplicate reviews from the same reviewer for the same project
reviewSchema.index({ projectId: 1, reviewerId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
