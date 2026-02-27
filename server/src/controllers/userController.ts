import { Response } from 'express';
import User, { UserRole, UserStatus } from '@/models/userModel';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/appError';

export const getAllUsers = catchAsync(async (req: any, res: Response) => {
    const { search, role, status, sort } = req.query;

    let query: any = {};

    // Search by name or email
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
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
        mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    const users = await mongooseQuery;

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
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
