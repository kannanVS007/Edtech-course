import express from 'express';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@/controllers/categoryController';
import { protect, restrictTo } from '@/middleware/authMiddleware';
import { UserRole } from '@/models/userModel';

const router = express.Router();

router.route('/').get(getAllCategories).post(protect, restrictTo(UserRole.ADMIN), createCategory);

router
    .route('/:id')
    .patch(protect, restrictTo(UserRole.ADMIN), updateCategory)
    .delete(protect, restrictTo(UserRole.ADMIN), deleteCategory);

export default router;
