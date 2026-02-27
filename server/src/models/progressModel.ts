import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    completedModules: mongoose.Types.ObjectId[];
    quizScores: {
        quiz: mongoose.Types.ObjectId;
        score: number;
        completedAt: Date;
    }[];
    isCompleted: boolean;
}

const ProgressSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        completedModules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
        quizScores: [
            {
                quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
                score: { type: Number, required: true },
                completedAt: { type: Date, default: Date.now },
            },
        ],
        isCompleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);
