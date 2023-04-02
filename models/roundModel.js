import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const roundSchema = new Schema(
    {
        election_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Election',
        },

        number: { type: Number },
        status: { type: String },
    },
    { timestamps: true }
);

const Round = model('Round', roundSchema);

export default Round;