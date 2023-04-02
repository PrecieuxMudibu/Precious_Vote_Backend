import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String },
        first_name: { type: String },
        post_name: { type: String },
        email: { type: String },
        password: { type: String },
        profile_picture: { type: String },
    },
    { timestamps: true }
);

userSchema.plugin(mongooseUniqueValidator);

const User = model('User', userSchema);
export default User;
