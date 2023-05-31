import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const electionSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: { type: String, required: true },
        tariff: {
            type: String,
            required: true,
            enum: ['Free', 'Premium', 'VIP'],
        },
        description: { type: String },
        picture: { type: String },
        first_round_eligibility_criteria: { type: Number },
        candidates_for_the_second_round: { type: Number },
        status: {
            type: String,
            enum: ['Not yet', 'In progress', 'Completed'],
        },
        two_rounds: { type: Boolean },
        electors: [
            {
                type: String,
                enum: ['Not yet', 'In progress', 'Completed'],
                ref: 'Elector',
            },
        ],
    },
    { timestamps: true }
);

const Election = model('Election', electionSchema);

export default Election;
