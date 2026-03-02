"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moduleController_1 = require("../controllers/moduleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userModel_1 = require("../models/userModel");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.post('/', (0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), moduleController_1.createModule);
router
    .route('/:id')
    .patch((0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), moduleController_1.updateModule)
    .delete((0, authMiddleware_1.restrictTo)(userModel_1.UserRole.ADMIN), moduleController_1.deleteModule);
exports.default = router;
