"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuiz = exports.createQuiz = exports.getQuizByCourse = void 0;
const quizModel_1 = __importDefault(require("../models/quizModel"));
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
exports.getQuizByCourse = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const quiz = await quizModel_1.default.findOne({ course: req.params.courseId });
    if (!quiz)
        return next(new appError_1.AppError('No quiz found for this course', 404));
    res.status(200).json({ status: 'success', data: { quiz } });
});
exports.createQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const newQuiz = await quizModel_1.default.create(req.body);
    res.status(201).json({ status: 'success', data: { quiz: newQuiz } });
});
exports.updateQuiz = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const quiz = await quizModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!quiz)
        return next(new appError_1.AppError('No quiz found with that ID', 404));
    res.status(200).json({ status: 'success', data: { quiz } });
});
