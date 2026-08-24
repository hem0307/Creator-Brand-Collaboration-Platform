import express from 'express';
import {
  applyToCampaign,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getBrandApplications
} from '../controllers/applicationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('creator'), applyToCampaign);

router.get('/brand', protect, authorize('brand'), getBrandApplications);
router.get('/me', protect, authorize('creator'), getMyApplications);

router.route('/:id')
  .put(protect, authorize('brand'), updateApplicationStatus)
  .delete(protect, authorize('creator'), withdrawApplication);

export default router;
