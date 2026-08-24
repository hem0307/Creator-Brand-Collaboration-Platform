import express from 'express';
import {
  getWorkspaces,
  getWorkspaceById,
  submitMilestone,
  approveMilestone,
  requestMilestoneChanges,
  completeWorkspace,
  markPaymentPaid,
  addMessage
} from '../controllers/workspaceController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getWorkspaces);

router.route('/:id')
  .get(protect, getWorkspaceById);

router.route('/:id/milestones')
  .post(protect, authorize('creator'), submitMilestone);

router.route('/:id/milestones/:mId/approve')
  .patch(protect, authorize('brand'), approveMilestone);

router.route('/:id/milestones/:mId')
  .patch(protect, authorize('brand'), approveMilestone);

router.route('/:id/milestones/:mId/request-changes')
  .patch(protect, authorize('brand'), requestMilestoneChanges);

router.route('/:id/complete')
  .patch(protect, authorize('brand'), completeWorkspace);

router.route('/:id/pay')
  .patch(protect, authorize('brand'), markPaymentPaid);

router.route('/:id/messages')
  .post(protect, addMessage);

export default router;
