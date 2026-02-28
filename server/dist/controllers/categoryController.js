"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
const categoryModel_1 = __importDefault(require("@/models/categoryModel"));
const catchAsync_1 = require("@/utils/catchAsync");
const appError_1 = require("@/utils/appError");
exports.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categories = await categoryModel_1.default.find();
    res.status(200).json({ status: 'success', data: { categories } });
});
exports.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const newCategory = await categoryModel_1.default.create(req.body);
    res.status(201).json({ status: 'success', data: { category: newCategory } });
});
exports.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const category = await categoryModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!category)
        return next(new appError_1.AppError('No category found with that ID', 404));
    res.status(200).json({ status: 'success', data: { category } });
});
exports.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const category = await categoryModel_1.default.findByIdAndDelete(req.params.id);
    if (!category)
        return next(new appError_1.AppError('No category found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
});
