import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const electionSchema = new Schema(
    {
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: { type: String, required: true },
        tariff: {
            type: String,
            required: true,
            enum: ['Free', 'Premium', 'VIP'],
            default: 'Free',
        },
        description: { type: String },
        picture: { type: String },
        first_round_eligibility_criteria: { type: Number },
        candidates_for_the_second_round: { type: Number },
        two_rounds: { type: Boolean },
        electors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Elector',
            },
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    { timestamps: true }
);

const Election = model('Election', electionSchema);

export default Election;
