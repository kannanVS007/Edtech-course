import express from 'express';
import {
    getAllUsers,
    getUser,
    updateUserRole,
    updateUserStatus,
    getUserStats,
    deleteUser
} from '@/controllers/userController';
import { protect, restrictTo } from '@/middleware/authMiddleware';
import { UserRole } from '@/models/userModel';

const router = express.Router();

// All routes after this are protected
router.use(protect);

// User Profile & Stats (Accessible by all logged-in users)
// User Profile (Accessible by all logged-in users)

// All routes after this are restricted to admin
router.use(restrictTo(UserRole.ADMIN));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

export default router;
