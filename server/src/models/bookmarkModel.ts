import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    module: mongoose.Types.ObjectId;
}

const BookmarkSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    },
    { timestamps: true },
);

BookmarkSchema.index({ user: 1, course: 1 });

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
