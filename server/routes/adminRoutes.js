import express from 'express';
import {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  deleteProject,
  getReports,
  updateReportStatus
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Apply auth and admin checkups to all endpoints
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.delete('/projects/:id', deleteProject);
router.get('/reports', getReports);
router.put('/reports/:id', updateReportStatus);

export default router;
