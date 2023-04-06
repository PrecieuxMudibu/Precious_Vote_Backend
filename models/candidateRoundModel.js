import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const candidateRoundSchema = new Schema(
    {
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

const CandidateRound = model('CandidateRound', candidateRoundSchema);

export default CandidateRound;
