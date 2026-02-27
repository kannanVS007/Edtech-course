import mongoose from 'mongoose';
import app from './app';
import { env } from '@/config/env';

const PORT = env.PORT || 5000;


mongoose
    .connect(env.MONGO_URI)
    .then(() => console.log('✅ DB connection successful!'))
    .catch((err) => {
        console.error('❌ DB connection error:', err.message);
        console.log('💡 Update MONGO_URI in server/.env with your real Atlas connection string');
    });


const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
