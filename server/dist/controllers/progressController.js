"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgress = exports.getProgress = void 0;
const progressModel_1 = __importDefault(require("../models/progressModel"));
const catchAsync_1 = require("../utils/catchAsync");
exports.getProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const progress = await progressModel_1.default.findOne({
        user: req.user._id,
        course: req.params.courseId,
    }).populate('completedModules');
    res.status(200).json({ status: 'success', data: { progress } });
});
exports.updateProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { moduleId, quizScore, quizId } = req.body;
    let progress = await progressModel_1.default.findOne({
        user: req.user._id,
        course: req.params.courseId,
    });
    if (!progress) {
        progress = await progressModel_1.default.create({
            user: req.user._id,
            course: req.params.courseId,
        });
    }
    if (moduleId && !progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
    }
    if (quizId && quizScore !== undefined) {
        progress.quizScores.push({
            quiz: quizId,
            score: quizScore,
            completedAt: new Date(),
        });
    }
    await progress.save();
    res.status(200).json({ status: 'success', data: { progress } });
});
