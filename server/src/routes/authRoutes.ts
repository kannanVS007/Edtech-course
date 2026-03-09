import express from 'express';
import { signup, login, googleLogin, githubLogin } from '@/controllers/authController';
import { getUserStats } from '@/controllers/userController';
import { protect } from '@/middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/github-login', githubLogin);

// Dashboard Stats (Protected but not Admin restricted)
router.get('/stats', protect, getUserStats);

export default router;
