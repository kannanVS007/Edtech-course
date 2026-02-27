import { Response } from 'express';
import Progress from '@/models/progressModel';
import { catchAsync } from '@/utils/catchAsync';
import { AuthRequest } from '@/middleware/authMiddleware';

export const getProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const progress = await Progress.findOne({
        user: req.user!._id,
        course: req.params.courseId,
    }).populate('completedModules');

    res.status(200).json({ status: 'success', data: { progress } });
});

export const updateProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const { moduleId, quizScore, quizId } = req.body;

    let progress = await Progress.findOne({
        user: req.user!._id,
        course: req.params.courseId,
    });

    if (!progress) {
        progress = await Progress.create({
            user: req.user!._id,
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
