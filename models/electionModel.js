import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const { Schema, model } = mongoose;

const electionSchema = new Schema(
    {
        name: { type: String, unique: true },
        description: { type: String, unique: true },
        picture: { type: String },
        begin_date: { type: Date },
        end_date: { type: Date },
        first_round_eligibility_criteria: { type: Number },
        finished: { type: Boolean },
    },
    { timestamps: true }
);

electionSchema.plugin(mongooseUniqueValidator);

const User = model('Election', electionSchema);
export default User;
