import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    courseId: string;
    description: string;
    thumbnail: string;
    category: mongoose.Types.ObjectId;
    instructor: string;
    price: number;
    modules: mongoose.Types.ObjectId[];
    totalModules: number;
}

const CourseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        courseId: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        thumbnail: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        instructor: { type: String, required: true },
        price: { type: Number, default: 0 },
        modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
        totalModules: { type: Number, default: 0 },
    },
    { timestamps: true },
);

CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ category: 1 });

export default mongoose.model<ICourse>('Course', CourseSchema);
