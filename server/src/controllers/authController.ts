import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { IUser, UserRole } from '@/models/userModel';
import { catchAsync } from '@/utils/catchAsync';
import User from '@/models/userModel';
import { AppError } from '@/utils/appError';
import { OAuth2Client } from 'google-auth-library';
import { sendWelcomeEmail } from '@/utils/email';
import { z } from 'zod';
import axios from 'axios';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.string().optional(),
    mobile: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const signToken = (id: string) => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: '90d',
    });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
    const token = signToken((user._id as any).toString());

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

export const signup = catchAsync(async (req: any, res: any, next: any) => {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
        return next(new AppError(validation.error.issues[0].message, 400));
    }

    const { name, email, password, role, mobile } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
        return next(new AppError('User with this email already exists', 400));
    }

    const newUser = await User.create({
        name,
        email,
        password,
        role: role || 'user',
        mobile,
    });

    // Send Welcome Email
    await sendWelcomeEmail(newUser.email, newUser.name);

    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: any, res: any, next: any) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return next(new AppError(validation.error.issues[0].message, 400));
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

export const googleLogin = catchAsync(async (req: any, res: any, next: any) => {
    const { idToken } = req.body;

    if (!idToken) {
        return next(new AppError('Please provide Google ID Token', 400));
    }

    const ticket = await client.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        return next(new AppError('Invalid Google Token', 400));
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
        return next(new AppError('Email not found in Google token', 400));
    }

    // Find or create user
    let user = await User.findOne({
        $or: [{ googleId: googleId }, { email: email }]
    });

    if (!user) {
        user = await User.create({
            name: name || 'Google User',
            email: email,
            password: Math.random().toString(36).slice(-12) + 'aA1!', // Ensure complexity
            role: UserRole.USER,
            googleId: googleId,
            avatar: picture,
        });

        // Send Welcome Email
        await sendWelcomeEmail(user.email, user.name);
    }

    createSendToken(user, 200, res);
});

export const githubLogin = catchAsync(async (req: any, res: any, next: any) => {
    const { code } = req.body;

    if (!code) {
        return next(new AppError('Please provide GitHub authorization code', 400));
    }

    // 1) Exchange code for access token
    const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
        },
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
        return next(new AppError('Invalid GitHub code or configuration', 400));
    }

    // 2) Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `token ${accessToken}`,
        },
    });

    const { login, id: githubId, avatar_url, name, email: githubEmail } = userResponse.data;

    // GitHub might not return public email, get it from emails endpoint
    let email = githubEmail;
    if (!email) {
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        const primaryEmail = emailsResponse.data.find((e: any) => e.primary);
        email = primaryEmail ? primaryEmail.email : null;
    }

    if (!email) {
        return next(new AppError('Email not found in GitHub account. Please make it public or use another method.', 400));
    }

    // 3) Find or create user
    let user = await User.findOne({
        $or: [{ githubId: githubId.toString() }, { email: email }]
    });

    if (!user) {
        user = await User.create({
            name: name || login || 'GitHub User',
            email: email,
            password: Math.random().toString(36).slice(-12) + 'aA1!',
            role: UserRole.USER,
            githubId: githubId.toString(),
            avatar: avatar_url,
        });

        // Send Welcome Email
        await sendWelcomeEmail(user.email, user.name);
    }

    createSendToken(user, 200, res);
});
