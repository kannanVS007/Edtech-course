"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModule = exports.updateModule = exports.createModule = void 0;
const moduleModel_1 = __importDefault(require("../models/moduleModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
exports.createModule = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // Check if course exists
    const course = await courseModel_1.default.findById(req.body.course);
    if (!course)
        return next(new appError_1.AppError('No course found with that ID', 404));
    const newModule = await moduleModel_1.default.create(req.body);
    // Add module to course
    course.modules.push(newModule._id);
    course.totalModules += 1;
    await course.save();
    res.status(201).json({ status: 'success', data: { module: newModule } });
});
exports.updateModule = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const updatedModule = await moduleModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedModule)
        return next(new appError_1.AppError('No module found with that ID', 404));
    res.status(200).json({ status: 'success', data: { module: updatedModule } });
});
exports.deleteModule = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const deletedModule = await moduleModel_1.default.findByIdAndDelete(req.params.id);
    if (!deletedModule)
        return next(new appError_1.AppError('No module found with that ID', 404));
    // Remove module from course
    await courseModel_1.default.findByIdAndUpdate(deletedModule.course, {
        $pull: { modules: deletedModule._id },
        $inc: { totalModules: -1 },
    });
    res.status(204).json({ status: 'success', data: null });
});
