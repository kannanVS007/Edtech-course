"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userModel_1 = require("../models/userModel");
const router = express_1.default.Router();
router.route('/').get(courseController_1.getAllCourses).post(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), courseController_1.createCourse);
router
    .route('/:id')
    .get(courseController_1.getCourse)
    .patch(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), courseController_1.updateCourse)
    .delete(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), courseController_1.deleteCourse);
exports.default = router;
