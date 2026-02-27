import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from '@/middleware/errorMiddleware';
import { AppError } from '@/utils/appError';
import rateLimit from 'express-rate-limit';

// Routes
import authRouter from '@/routes/authRoutes';
import categoryRouter from '@/routes/categoryRoutes';
import courseRouter from '@/routes/courseRoutes';
import moduleRouter from '@/routes/moduleRoutes';
import quizRouter from '@/routes/quizRoutes';
import progressRouter from '@/routes/progressRoutes';
import userRouter from '@/routes/userRoutes';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Route mounting
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/modules', moduleRouter);
app.use('/api/v1/quizzes', quizRouter);
app.use('/api/v1/progress', progressRouter);

// Health Check
app.use('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// 404 handler (Catch-all middleware)
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
