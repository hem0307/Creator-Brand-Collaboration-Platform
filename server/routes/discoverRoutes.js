import express from 'express';
import { discoverCreators, discoverBrands } from '../controllers/discoverController.js';

const router = express.Router();

router.get('/creators', discoverCreators);
router.get('/brands', discoverBrands);

export default router;
