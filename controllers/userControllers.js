import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function register(request, response, next) {
    bcrypt
        .hash(request.body.password, 10)
        .then((hash) => {
            const user = new User({
                name: request.body.name,
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

                    const token = jwt.sign(payload, 'NEVER GIVE UP', {
                        expiresIn: '1d',
                    });

                    return response.status(201).json({
                        message: 'Votre compte a été créé avec succès.',
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            profile_picture: user.profile_picture,
                            token: 'Bearer ' + token,
                        },
                    });
                })
                .catch((error) => response.status(400).json({ error }));
        })
        .catch((error) => response.status(500).json({ error }));
}

function login(request, response) {
    const secret = process.env.JWT_SECRET;

    const { email, password } = request.body;

    if (!email || !password)
        return response.status(400).json({
            type: 'Error',
            message: 'The pseudo and password are required',
        });

    User.findOne({
        email: email,
    }).then((user) => {
        if (!user) {
            return response.status(401).json({
                message:
                    'Les identifiants que vous avez entré sont incorrectes, veillez réessayer',
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return response
                .status(401)
                .json({ message: 'Mot de passe incorrect' });
        }

        const payload = {
            name: user.name,
            id: user._id,
        };

        const token = jwt.sign(payload, secret, { expiresIn: '1d' });

        return response.status(200).json({
            message: 'Vous êtes connecté !',
            user: {
                _id: user._id,
                name: user.name,
                first_name: user.first_name,
                post_name: user.post_name,
                email: user.email,
                profile_picture: user.profile_picture,
                token: 'Bearer ' + token,
            },
        });
    });
}

function get_user(request, response) {
    const { _id } = request.params;

    const query = { _id: _id };

    User.findOne(query)
        .then((user) =>
            response.status(200).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profile_picture: user.profile_picture,
                },
            })
        )
        .catch((error) => response.status(500).json({ error }));
}

function update_user(request, response) {
    const { _id } = request.params;

    const { name, email, old_password, password, profile_picture } =
        request.body;

    let update = { name, email, profile_picture };

    User.findOne({ _id })
        .then(async (user) => {
            if (!user) {
                return response.status(401).json({
                    message:
                        'Les identifiants que vous avez entrés sont incorrects, veuillez réessayer.',
                });
            }

            if (!bcrypt.compareSync(old_password, user.password)) {
                return response.status(401).json({
                    message: 'Votre ancien mot de passe est incorrect.',
                });
            }
            if (!password) {
                return response.status(401).json({
                    message: 'Votre nouveau mot de passe est vide.',
                });
            }
            const crypted_password = await bcrypt.hash(password, 10);
            update = { ...update, password: crypted_password };

            User.findOneAndUpdate({ _id }, update, {
                new: true,
            })
                .then((user) => {
                    return response.status(200).json({
                        message:
                            'Vos informations ont été mises à jour avec succès',
                        user,
                    });
                })
                .catch((error) => response.status(500).json({ error }));
        })
        .catch((error) => response.status(500).json({ error }));
}
export { register, login, get_user, update_user };
