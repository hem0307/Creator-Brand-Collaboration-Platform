import express from 'express';
import {
  getInboxSummary,
  getChatMessages,
  sendMessage,
  markThreadAsRead
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/inbox', getInboxSummary);
router.get('/thread/:projectId', getChatMessages);
router.post('/thread/:projectId', sendMessage);
router.put('/thread/:projectId/read', markThreadAsRead);

export default router;
