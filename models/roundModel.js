import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const roundSchema = new Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },

        number: { type: Number },
        begin_date: { type: Date },
        end_date: { type: Date },
        status: {
            type: String,
            enum: ['Not started', 'In progress', 'Completed'],
        },
        candidates: [
            new Schema({
                voices: { type: mongoose.Schema.Types.Number, default: 0 },
                candidate: {
                    type: mongoose.Schema.Types.Array,
                    ref: 'Candidate',
                },
            }),
        ],
    },
    { timestamps: true }
);

const Round = model('Round', roundSchema);

export default Round;
