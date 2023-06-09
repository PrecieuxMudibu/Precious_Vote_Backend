import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        name: { type: String },
        election_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Election',
        },
    },
       
    { timestamps: true }
);

const Post = model('Post', postSchema);

export default Post;
