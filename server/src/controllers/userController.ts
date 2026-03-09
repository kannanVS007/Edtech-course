import { Response } from 'express';
import User, { UserRole, UserStatus } from '@/models/userModel';
import Progress from '@/models/progressModel';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/appError';

export const getAllUsers = catchAsync(async (req: any, res: Response) => {
    const { search, role, status, sort } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    let query: any = { role: { $ne: 'bot' } }; // Exclude bot/system users explicitly

    // Search by name or email
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by role
    if (role) {
        query.role = role;
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    let mongooseQuery = User.find(query).lean();

    // Sorting
    if (sort) {
        const sortBy = (sort as string).split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery = mongooseQuery.sort('-lastLogin -createdAt');
    }

    mongooseQuery = mongooseQuery.skip(skip).limit(limit);

    // Execute queries in parallel
    const [users, totalUsers] = await Promise.all([
        mongooseQuery,
        User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users, totalUsers, totalPages, page, limit }
    });
});

export const getUser = catchAsync(async (req: any, res: Response, next: any) => {
    const user = await User.findById(req.params.id).lean();

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

export const updateUserRole = catchAsync(async (req: any, res: Response, next: any) => {
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
        return next(new AppError('Invalid role', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

export const updateUserStatus = catchAsync(async (req: any, res: Response, next: any) => {
    const { status } = req.body;

    if (!Object.values(UserStatus).includes(status)) {
        return next(new AppError('Invalid status', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

export const getUserStats = catchAsync(async (req: any, res: Response) => {
    const userId = req.user._id;

    const [progress, user] = await Promise.all([
        Progress.find({ user: userId }).lean(),
        User.findById(userId).select('enrolledCourses').lean()
    ]);

    const completedCoursesCount = progress.filter(p => p.isCompleted).length;
    const enrolledCount = user?.enrolledCourses?.length || 0;
    const activeCoursesCount = enrolledCount - completedCoursesCount;

    // Calculate total modules completed across all courses
    const totalModulesCompleted = progress.reduce((acc, curr) => acc + (curr.completedModules?.length || 0), 0);

    // Estimate learning hours (e.g., 45 mins per module)
    const learningHours = Math.round((totalModulesCompleted * 45) / 60);

    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                completedCourses: completedCoursesCount,
                activeCourses: Math.max(0, activeCoursesCount),
                certificates: completedCoursesCount,
                learningHours: `${learningHours}h`
            }
        }
    });
});

export const deleteUser = catchAsync(async (req: any, res: Response, next: any) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
