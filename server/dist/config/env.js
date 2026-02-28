"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    MONGO_URI: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(10),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    GITHUB_CLIENT_ID: zod_1.z.string().optional(),
    GITHUB_CLIENT_SECRET: zod_1.z.string().optional(),
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    EMAIL_HOST: zod_1.z.string(),
    EMAIL_PORT: zod_1.z.string(),
    EMAIL_USER: zod_1.z.string(),
    EMAIL_PASS: zod_1.z.string(),
    FROM_EMAIL: zod_1.z.string().email(),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
