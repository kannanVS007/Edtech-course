"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("@/controllers/categoryController");
const authMiddleware_1 = require("@/middleware/authMiddleware");
const userModel_1 = require("@/models/userModel");
const router = express_1.default.Router();
router.route('/').get(categoryController_1.getAllCategories).post(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), categoryController_1.createCategory);
router
    .route('/:id')
    .patch(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), categoryController_1.updateCategory)
    .delete(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), categoryController_1.deleteCategory);
exports.default = router;
