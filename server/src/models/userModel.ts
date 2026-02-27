import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum UserStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    status: UserStatus;
    mobile?: string;
    avatar?: string;
    googleId?: string;
    githubId?: string;
    enrolledCourses: mongoose.Types.ObjectId[];
    passwordChangedAt?: Date;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: [true, 'Please provide your name'] },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
            index: true,
        },
        mobile: { type: String },
        avatar: { type: String },
        googleId: { type: String },
        githubId: { type: String },
        enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        passwordChangedAt: Date,
    },
    { timestamps: true },
);

// Indexes for search
UserSchema.index({ name: 'text', email: 'text' });



UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password!, 12);
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return await bcrypt.compare(candidate, this.password!);
};

export default mongoose.model<IUser>('User', UserSchema);
