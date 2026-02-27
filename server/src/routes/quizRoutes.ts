import express from 'express';
import { getQuizByCourse, createQuiz, updateQuiz } from '@/controllers/quizController';
import { protect, restrictTo } from '@/middleware/authMiddleware';
import { UserRole } from '@/models/userModel';

const router = express.Router();

router.use(protect);

router.get('/course/:courseId', getQuizByCourse);

router.post('/', restrictTo(UserRole.ADMIN), createQuiz);
router.patch('/:id', restrictTo(UserRole.ADMIN), updateQuiz);

export default router;
