import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    module: mongoose.Types.ObjectId;
    content: string;
}

const NoteSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
        content: { type: String, required: true },
    },
    { timestamps: true },
);

NoteSchema.index({ user: 1, course: 1 });

export default mongoose.model<INote>('Note', NoteSchema);
