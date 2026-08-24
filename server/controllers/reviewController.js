import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

// @desc    Create a project review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { projectId, revieweeId, rating, comment } = req.body;

    if (!projectId || !revieweeId || !rating || !comment) {
      res.status(400);
      throw new Error('Please fill in all review fields');
    }

    // Check for duplicate reviews
    const alreadyReviewed = await Review.findOne({ projectId, reviewerId: req.user._id });
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already submitted a review for this project collaboration');
    }

    const review = await Review.create({
      projectId,
      reviewerId: req.user._id,
      revieweeId,
      rating: Number(rating),
      comment
    });

    // Notify reviewee
    await Notification.create({
      recipientId: revieweeId,
      senderId: req.user._id,
      type: 'system_alert',
      title: 'New Feedback Review Received',
      body: `${req.user.name} has left you a ${rating}-star feedback review!`,
      link: req.user.role === 'creator' ? `/brands/${req.user._id}` : `/creators/${req.user._id}`
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user reviews and average calculation
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name profileImage')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      avgRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    next(error);
  }
};
