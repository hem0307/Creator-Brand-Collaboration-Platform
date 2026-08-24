import express from 'express';
import { getCreatorProfile, updateMyPortfolio, toggleCreatorBookmark } from '../controllers/creatorController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public profile — optionalAuth so brands get bookmark status
router.get('/:id', optionalAuth, getCreatorProfile);

// Creator portfolio management
router.put('/me', protect, authorize('creator'), updateMyPortfolio);

// Brand saves/unsaves a creator
router.post('/:id/bookmark', protect, authorize('brand'), toggleCreatorBookmark);

export default router;
