"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getAllCourses = void 0;
const courseModel_1 = __importDefault(require("@/models/courseModel"));
const catchAsync_1 = require("@/utils/catchAsync");
const appError_1 = require("@/utils/appError");
exports.getAllCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courses = await courseModel_1.default.find().populate('category', 'name').lean();
    res.status(200).json({ status: 'success', results: courses.length, data: { courses } });
});
exports.getCourse = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const course = await courseModel_1.default.findById(req.params.id).populate('modules').populate('category', 'name').lean();
    if (!course)
        return next(new appError_1.AppError('No course found with that ID', 404));
    res.status(200).json({ status: 'success', data: { course } });
});
exports.createCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const newCourse = await courseModel_1.default.create(req.body);
    res.status(201).json({ status: 'success', data: { course: newCourse } });
});
exports.updateCourse = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const course = await courseModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!course)
        return next(new appError_1.AppError('No course found with that ID', 404));
    res.status(200).json({ status: 'success', data: { course } });
});
exports.deleteCourse = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const course = await courseModel_1.default.findByIdAndDelete(req.params.id);
    if (!course)
        return next(new appError_1.AppError('No course found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
});
