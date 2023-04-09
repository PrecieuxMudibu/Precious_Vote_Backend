import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const electorCandidateRoundSchema = new Schema(
    {
        elector_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Elector',
        },
        candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
        },
        round_id: {
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
