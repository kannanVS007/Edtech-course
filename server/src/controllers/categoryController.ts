import { Response } from 'express';
import Category from '@/models/categoryModel';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/appError';

export const getAllCategories = catchAsync(async (req: any, res: Response) => {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', data: { categories } });
});

export const createCategory = catchAsync(async (req: any, res: Response) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json({ status: 'success', data: { category: newCategory } });
});

export const updateCategory = catchAsync(async (req: any, res: Response, next: any) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!category) return next(new AppError('No category found with that ID', 404));
    res.status(200).json({ status: 'success', data: { category } });
});

export const deleteCategory = catchAsync(async (req: any, res: Response, next: any) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError('No category found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
});
