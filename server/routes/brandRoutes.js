import express from 'express';
import { getBrandProfile, updateMyBrandProfile } from '../controllers/brandController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/:id', getBrandProfile);
router.put('/me', protect, authorize('brand'), updateMyBrandProfile);

export default router;
