"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const PORT = env_1.env.PORT || 5000;
mongoose_1.default
    .connect(env_1.env.MONGO_URI)
    .then(() => console.log('✅ DB connection successful!'))
    .catch((err) => {
    console.error('❌ DB connection error:', err.message);
    console.log('💡 Update MONGO_URI in server/.env with your real Atlas connection string');
});
const server = app_1.default.listen(PORT, () => {
    console.log(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${PORT}`);
});
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
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
