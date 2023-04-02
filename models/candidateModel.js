import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const candidateSchema = new Schema(
    {
        election_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Election',
        },
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },

        name: { type: String },
        first_name: { type: String },
        picture: { type: String },
    },
    { timestamps: true }
);

const Candidate = model('Candidate', candidateSchema);

export default Candidate;
