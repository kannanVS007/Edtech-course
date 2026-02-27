import express from 'express';
import { createModule, updateModule, deleteModule } from '@/controllers/moduleController';
import { protect, restrictTo } from '@/middleware/authMiddleware';
import { UserRole } from '@/models/userModel';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo(UserRole.ADMIN), createModule);

router
    .route('/:id')
    .patch(restrictTo(UserRole.ADMIN), updateModule)
    .delete(restrictTo(UserRole.ADMIN), deleteModule);

export default router;
