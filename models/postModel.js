import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        name: { type: String },
        election: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Election',
        },
        candidates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Candidate',
            },
        ],
        rounds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Round',
            },
        ],
    },

    { timestamps: true }
);

const Post = model('Post', postSchema);

export default Post;
