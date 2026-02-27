import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
    title: string;
    youtubeUrl: string;
    order: number;
    courseId: string;
    course: mongoose.Types.ObjectId;
}

const ModuleSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        youtubeUrl: { type: String, required: true },
        order: { type: Number, required: true },
        courseId: { type: String, required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    },
    { timestamps: true },
);

ModuleSchema.index({ courseId: 1, order: 1 });

export default mongoose.model<IModule>('Module', ModuleSchema);
