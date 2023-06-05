import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const electorSchema = new Schema(
    {
        election: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Election',
        },

        name: { type: String },
        first_name: { type: String },
        email: { type: String },
        token_for_vote: { type: String },
    },
    { timestamps: true }
);

const Elector = model('Elector', electorSchema);

export default Elector;

