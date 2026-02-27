import express from 'express';
import { signup, login, googleLogin, githubLogin } from '@/controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/github-login', githubLogin);

export default router;
