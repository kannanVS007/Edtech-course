import express from 'express';
import {
    getAllUsers,
    getUser,
    updateUserRole,
    updateUserStatus,
    deleteUser
} from '@/controllers/userController';
import { protect, restrictTo } from '@/middleware/authMiddleware';
import { UserRole } from '@/models/userModel';

const router = express.Router();

// All routes after this are protected and restricted to admin
router.use(protect);
router.use(restrictTo(UserRole.ADMIN));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

export default router;
