import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const electionSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: { type: String, required: true },
        tariff_id: { type: String, required: true },
        description: { type: String },
        picture: { type: String },
        first_round_eligibility_criteria: { type: Number },
        status: {
            type: String,
            enum: ['Not yet', 'In progress', 'Completed'],
        },
    },
    { timestamps: true }
);

const Election = model('Election', electionSchema);

export default Election;
