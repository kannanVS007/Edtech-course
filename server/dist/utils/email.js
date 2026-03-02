"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.EMAIL_HOST,
    port: parseInt(env_1.env.EMAIL_PORT),
    secure: env_1.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: env_1.env.EMAIL_USER,
        pass: env_1.env.EMAIL_PASS,
    },
});
const sendWelcomeEmail = async (to, name) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Inter', sans-serif; color: #1f2937; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .header { text-align: center; margin-bottom: 40px; }
                .logo { font-size: 28px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 2px; }
                .content { background: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                .button { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-top: 24px; }
                .footer { text-align: center; margin-top: 40px; font-size: 14px; text-color: #6b7280; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Become A Skiller</div>
                </div>
                <div class="content">
                    <h1>Welcome to the Community, ${name}! 🚀</h1>
                    <p>We're thrilled to have you on board. You've just taken the first step towards mastering new skills with our premium bilingual EdTech platform.</p>
                    <p>Start exploring our elite courses and join the ranks of high-performers worldwide.</p>
                    <a href="http://localhost:3000/login" class="button">Log In to Your Dashboard</a>
                    <p style="margin-top: 32px;">If you have any questions, our support team is always here for you.</p>
                </div>
                <div class="footer">
                    &copy; 2026 Become A Skiller. Built for Excellence.
                </div>
            </div>
        </body>
        </html>
    `;
    try {
        await transporter.sendMail({
            from: `"Become A Skiller" <${env_1.env.FROM_EMAIL}>`,
            to,
            subject: 'Welcome to Become A Skiller! 🚀',
            html: htmlContent,
        });
        console.log(`✅ Welcome email sent to ${to}`);
    }
    catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // We don't throw here to avoid failing registration if email fails
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
