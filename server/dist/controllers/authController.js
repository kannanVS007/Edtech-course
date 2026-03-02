"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubLogin = exports.googleLogin = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const userModel_1 = require("../models/userModel");
const catchAsync_1 = require("../utils/catchAsync");
const userModel_2 = __importDefault(require("../models/userModel"));
const appError_1 = require("../utils/appError");
const google_auth_library_1 = require("google-auth-library");
const email_1 = require("../utils/email");
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const client = new google_auth_library_1.OAuth2Client(env_1.env.GOOGLE_CLIENT_ID);
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, env_1.env.JWT_SECRET, {
        expiresIn: '90d',
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id.toString());
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
exports.signup = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
        return next(new appError_1.AppError(validation.error.issues[0].message, 400));
    }
    const { name, email, password, role, mobile } = validation.data;
    // Check if user already exists
    const existingUser = await userModel_2.default.findOne({ email }).lean();
    if (existingUser) {
        return next(new appError_1.AppError('User with this email already exists', 400));
    }
    const newUser = await userModel_2.default.create({
        name,
        email,
        password,
        role: role || 'user',
        mobile,
    });
    // Send Welcome Email
    await (0, email_1.sendWelcomeEmail)(newUser.email, newUser.name);
    createSendToken(newUser, 201, res);
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return next(new appError_1.AppError(validation.error.issues[0].message, 400));
    }
    const { email, password } = validation.data;
    const user = await userModel_2.default.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return next(new appError_1.AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 200, res);
});
exports.googleLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { idToken } = req.body;
    if (!idToken) {
        return next(new appError_1.AppError('Please provide Google ID Token', 400));
    }
    const ticket = await client.verifyIdToken({
        idToken,
        audience: env_1.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        return next(new appError_1.AppError('Invalid Google Token', 400));
    }
    const { email, name, picture, sub: googleId } = payload;
    if (!email) {
        return next(new appError_1.AppError('Email not found in Google token', 400));
    }
    // Find or create user
    let user = await userModel_2.default.findOne({
        $or: [{ googleId: googleId }, { email: email }]
    });
    if (!user) {
        user = await userModel_2.default.create({
            name: name || 'Google User',
            email: email,
            password: Math.random().toString(36).slice(-12) + 'aA1!', // Ensure complexity
            role: userModel_1.UserRole.USER,
            googleId: googleId,
            avatar: picture,
        });
        // Send Welcome Email
        await (0, email_1.sendWelcomeEmail)(user.email, user.name);
    }
    createSendToken(user, 200, res);
});
exports.githubLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { code } = req.body;
    if (!code) {
        return next(new appError_1.AppError('Please provide GitHub authorization code', 400));
    }
    // 1) Exchange code for access token
    const tokenResponse = await axios_1.default.post('https://github.com/login/oauth/access_token', {
        client_id: env_1.env.GITHUB_CLIENT_ID,
        client_secret: env_1.env.GITHUB_CLIENT_SECRET,
        code,
    }, {
        headers: {
            Accept: 'application/json',
        },
    });
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
        return next(new appError_1.AppError('Invalid GitHub code or configuration', 400));
    }
    // 2) Get user info from GitHub
    const userResponse = await axios_1.default.get('https://api.github.com/user', {
        headers: {
            Authorization: `token ${accessToken}`,
        },
    });
    const { login, id: githubId, avatar_url, name, email: githubEmail } = userResponse.data;
    // GitHub might not return public email, get it from emails endpoint
    let email = githubEmail;
    if (!email) {
        const emailsResponse = await axios_1.default.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        const primaryEmail = emailsResponse.data.find((e) => e.primary);
        email = primaryEmail ? primaryEmail.email : null;
    }
    if (!email) {
        return next(new appError_1.AppError('Email not found in GitHub account. Please make it public or use another method.', 400));
    }
    // 3) Find or create user
    let user = await userModel_2.default.findOne({
        $or: [{ githubId: githubId.toString() }, { email: email }]
    });
    if (!user) {
        user = await userModel_2.default.create({
            name: name || login || 'GitHub User',
            email: email,
            password: Math.random().toString(36).slice(-12) + 'aA1!',
            role: userModel_1.UserRole.USER,
            githubId: githubId.toString(),
            avatar: avatar_url,
        });
        // Send Welcome Email
        await (0, email_1.sendWelcomeEmail)(user.email, user.name);
    }
    createSendToken(user, 200, res);
});
