import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
    course: mongoose.Types.ObjectId;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
    }[];
    timer: number; // in minutes
}

const QuizSchema: Schema = new Schema(
    {
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, unique: true },
        questions: [
            {
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                correctAnswer: { type: Number, required: true },
                explanation: String,
            },
        ],
        timer: { type: Number, default: 10 },
    },
    { timestamps: true },
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
