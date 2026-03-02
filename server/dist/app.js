"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const appError_1 = require("./utils/appError");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const moduleRoutes_1 = __importDefault(require("./routes/moduleRoutes"));
const quizRoutes_1 = __importDefault(require("./routes/quizRoutes"));
const progressRoutes_1 = __importDefault(require("./routes/progressRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
// Global Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Route mounting
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/categories', categoryRoutes_1.default);
app.use('/api/v1/courses', courseRoutes_1.default);
app.use('/api/v1/modules', moduleRoutes_1.default);
app.use('/api/v1/quizzes', quizRoutes_1.default);
app.use('/api/v1/progress', progressRoutes_1.default);
// Health Check
app.use('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});
// 404 handler (Catch-all middleware)
app.use((req, res, next) => {
    next(new appError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global Error Handler
app.use(errorMiddleware_1.globalErrorHandler);
exports.default = app;
