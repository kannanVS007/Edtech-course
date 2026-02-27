import { Response } from 'express';
import Quiz from '@/models/quizModel';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/appError';

export const getQuizByCourse = catchAsync(async (req: any, res: Response, next: any) => {
    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) return next(new AppError('No quiz found for this course', 404));
    res.status(200).json({ status: 'success', data: { quiz } });
});

export const createQuiz = catchAsync(async (req: any, res: Response) => {
    const newQuiz = await Quiz.create(req.body);
    res.status(201).json({ status: 'success', data: { quiz: newQuiz } });
});

export const updateQuiz = catchAsync(async (req: any, res: Response, next: any) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!quiz) return next(new AppError('No quiz found with that ID', 404));
    res.status(200).json({ status: 'success', data: { quiz } });
});
