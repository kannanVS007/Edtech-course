"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("@/controllers/userController");
const authMiddleware_1 = require("@/middleware/authMiddleware");
const userModel_1 = require("@/models/userModel");
const router = express_1.default.Router();
// All routes after this are protected and restricted to admin
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN));
router.get('/', userController_1.getAllUsers);
router.get('/:id', userController_1.getUser);
router.patch('/:id/role', userController_1.updateUserRole);
router.patch('/:id/status', userController_1.updateUserStatus);
router.delete('/:id', userController_1.deleteUser);
exports.default = router;
