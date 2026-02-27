import { Response } from 'express';
import Course from '@/models/courseModel';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/appError';

export const getAllCourses = catchAsync(async (req: any, res: Response) => {
    const courses = await Course.find().populate('category', 'name').lean();
    res.status(200).json({ status: 'success', results: courses.length, data: { courses } });
});

export const getCourse = catchAsync(async (req: any, res: Response, next: any) => {
    const course = await Course.findById(req.params.id).populate('modules').populate('category', 'name').lean();
    if (!course) return next(new AppError('No course found with that ID', 404));
    res.status(200).json({ status: 'success', data: { course } });
});

export const createCourse = catchAsync(async (req: any, res: Response) => {
    const newCourse = await Course.create(req.body);
    res.status(201).json({ status: 'success', data: { course: newCourse } });
});

export const updateCourse = catchAsync(async (req: any, res: Response, next: any) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!course) return next(new AppError('No course found with that ID', 404));
    res.status(200).json({ status: 'success', data: { course } });
});

export const deleteCourse = catchAsync(async (req: any, res: Response, next: any) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return next(new AppError('No course found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
});
