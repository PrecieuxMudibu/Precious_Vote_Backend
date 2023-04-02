import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const { Schema, model } = mongoose;

const tariffSchema = new Schema(
    {
        name: { type: String, unique: true },
    },
    { timestamps: true }
);

tariffSchema.plugin(mongooseUniqueValidator);

const User = model('Tariff', tariffSchema);
export default User;
