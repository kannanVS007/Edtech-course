"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserStatus = exports.updateUserRole = exports.getUser = exports.getAllUsers = void 0;
const userModel_1 = __importStar(require("@/models/userModel"));
const catchAsync_1 = require("@/utils/catchAsync");
const appError_1 = require("@/utils/appError");
exports.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { search, role, status, sort } = req.query;
    let query = {};
    // Search by name or email
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }
    // Filter by role
    if (role) {
        query.role = role;
    }
    // Filter by status
    if (status) {
        query.status = status;
    }
    let mongooseQuery = userModel_1.default.find(query).lean();
    // Sorting
    if (sort) {
        const sortBy = sort.split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    }
    else {
        mongooseQuery = mongooseQuery.sort('-createdAt');
    }
    const users = await mongooseQuery;
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});
exports.getUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = await userModel_1.default.findById(req.params.id).lean();
    if (!user) {
        return next(new appError_1.AppError('No user found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});
exports.updateUserRole = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { role } = req.body;
    if (!Object.values(userModel_1.UserRole).includes(role)) {
        return next(new appError_1.AppError('Invalid role', 400));
    }
    const user = await userModel_1.default.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
    if (!user) {
        return next(new appError_1.AppError('No user found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});
exports.updateUserStatus = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { status } = req.body;
    if (!Object.values(userModel_1.UserStatus).includes(status)) {
        return next(new appError_1.AppError('Invalid status', 400));
    }
    const user = await userModel_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!user) {
        return next(new appError_1.AppError('No user found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});
exports.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = await userModel_1.default.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new appError_1.AppError('No user found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
