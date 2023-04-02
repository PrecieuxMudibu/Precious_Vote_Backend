import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

function register(request, response, next) {
    bcrypt
        .hash(request.body.password, 10)
        .then((hash) => {
            console.log('hash>>>', hash);
            const user = new User({
                name: request.body.name,
                first_name: request.body.first_name,
                post_name: request.body.post_name,
                email: request.body.email,
                password: hash,
                profile_picture:
                    'https://res.cloudinary.com/dzci2uq4z/image/upload/v1667309524/testFolder/avatar-removebg-preview_tkr7b0.png',
            });

            user.save()
                .then(() => {
                    const payload = {
                        name: user.name,
                        id: user._id,
                    };
                    console.log('payload>>>', payload);

                    const token = jwt.sign(payload, 'NEVER GIVE UP', {
                        expiresIn: '1d',
                    });

                    console.log('token>>>', token);

                    return response.status(201).json({
                        message: 'Votre compte a été créé avec succès.',
                        token: 'Bearer ' + token,
                        user: {
                            id: user._id,
                            name: user.name,
                            first_name: user.first_name,
                            post_name: user.post_name,
                            email: user.email,
                            profile_picture: user.profile_picture,
                        },
                    });
                })
                .catch((error) => response.status(400).json({ error }));
        })
        .catch((error) => {
            response.status(500).json({ error });
        });
}

export { register };
