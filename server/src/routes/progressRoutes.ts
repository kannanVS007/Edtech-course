import express from 'express';
import { getProgress, updateProgress } from '@/controllers/progressController';
import { protect } from '@/middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/:courseId', getProgress);
router.post('/:courseId', updateProgress);

export default router;
