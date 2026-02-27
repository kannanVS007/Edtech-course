import express from 'express';
import {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} from '@/controllers/courseController';
import { protect, restrictTo } from '@/middleware/authMiddleware';
import { UserRole } from '@/models/userModel';

const router = express.Router();

router.route('/').get(getAllCourses).post(protect, restrictTo(UserRole.ADMIN), createCourse);

router
    .route('/:id')
    .get(getCourse)
    .patch(protect, restrictTo(UserRole.ADMIN), updateCourse)
    .delete(protect, restrictTo(UserRole.ADMIN), deleteCourse);

export default router;
