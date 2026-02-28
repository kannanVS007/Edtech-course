"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@/config/env");
const appError_1 = require("@/utils/appError");
const catchAsync_1 = require("@/utils/catchAsync");
const userModel_1 = __importDefault(require("@/models/userModel"));
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError_1.AppError('You are not logged in! Please log in to get access.', 401));
    }
    // 2) Verification token
    const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = await userModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.AppError('The user belonging to this token no longer exists.', 401));
    }
    // 4) Check if user changed password after the token was issued
    // (Optional: Implement passwordChangedAt logic if needed)
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new appError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
