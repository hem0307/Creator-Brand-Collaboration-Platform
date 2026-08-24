import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  getMyCampaigns,
  updateCampaign,
  deleteCampaign,
  inviteCreatorToCampaign,
  respondToInvitation
} from '../controllers/campaignController.js';
import { getCampaignApplications } from '../controllers/applicationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCampaigns)
  .post(protect, authorize('brand'), createCampaign);

router.get('/me', protect, authorize('brand'), getMyCampaigns);

router.route('/:id')
  .get(protect, getCampaignById)
  .put(protect, authorize('brand'), updateCampaign)
  .delete(protect, authorize('brand'), deleteCampaign);

router.get('/:id/applications', protect, authorize('brand'), getCampaignApplications);
router.post('/:id/invite', protect, authorize('brand'), inviteCreatorToCampaign);
router.post('/:id/invitation-response', protect, authorize('creator'), respondToInvitation);

export default router;
