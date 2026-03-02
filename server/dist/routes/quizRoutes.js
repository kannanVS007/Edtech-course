"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizController_1 = require("../controllers/quizController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userModel_1 = require("../models/userModel");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.get('/course/:courseId', quizController_1.getQuizByCourse);
router.post('/', (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), quizController_1.createQuiz);
router.patch('/:id', (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), quizController_1.updateQuiz);
exports.default = router;
