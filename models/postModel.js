import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        name: { type: String },
    },
    { timestamps: true }
);

const Post = model('Post', postSchema);

export default Post;
