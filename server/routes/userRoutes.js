import express from 'express';
import { updateUserProfile, deleteUserAccount } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);

export default router;
