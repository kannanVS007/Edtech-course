import { Response } from 'express';
import Module from '@/models/moduleModel';
import Course from '@/models/courseModel';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/appError';

export const createModule = catchAsync(async (req: any, res: Response, next: any) => {
    // Check if course exists
    const course = await Course.findById(req.body.course);
    if (!course) return next(new AppError('No course found with that ID', 404));

    const newModule = await Module.create(req.body);

    // Add module to course
    course.modules.push(newModule._id as any);
    course.totalModules += 1;
    await course.save();

    res.status(201).json({ status: 'success', data: { module: newModule } });
});

export const updateModule = catchAsync(async (req: any, res: Response, next: any) => {
    const updatedModule = await Module.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedModule) return next(new AppError('No module found with that ID', 404));
    res.status(200).json({ status: 'success', data: { module: updatedModule } });
});

export const deleteModule = catchAsync(async (req: any, res: Response, next: any) => {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) return next(new AppError('No module found with that ID', 404));

    // Remove module from course
    await Course.findByIdAndUpdate(deletedModule.course, {
        $pull: { modules: deletedModule._id },
        $inc: { totalModules: -1 },
    });

    res.status(204).json({ status: 'success', data: null });
});
