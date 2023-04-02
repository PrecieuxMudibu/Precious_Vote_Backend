import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const electionSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        tariff_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TAriff',
        },

        name: { type: String },
        description: { type: String },
        picture: { type: String },
        begin_date: { type: Date },
        end_date: { type: Date },
        first_round_eligibility_criteria: { type: Number },
        finished: { type: Boolean },
    },
    { timestamps: true }
);

const Election = model('Election', electionSchema);

export default Election;