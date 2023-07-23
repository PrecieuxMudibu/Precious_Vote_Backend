import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const candidateRoundSchema = new Schema(
    {
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
        },
        round: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Round',
        },
        voices: {
            type: mongoose.Schema.Types.Number,
            default:0
        },
    },
    { timestamps: true }
);

const CandidateRound = model('CandidateRound', candidateRoundSchema);

export default CandidateRound;
