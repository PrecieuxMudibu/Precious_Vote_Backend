import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const electorCandidateRoundSchema = new Schema(
    {
        elector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Elector',
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
        },
        round: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Round',
        },
    },
    { timestamps: true }
);

const ElectorCandidateRound = model(
    'ElectorCandidateRound',
    electorCandidateRoundSchema
);

export default ElectorCandidateRound;
