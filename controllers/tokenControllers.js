import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function get_token(request, response, next) {
    const payload = {
        id: 'fake id',
    };

    const token = jwt.sign(payload, 'NEVER GIVE UP', {
        expiresIn: '1d',
    });

    return response.status(201).json({
        message: 'Votre token a été généré avec succès.',
        token: 'Bearer ' + token,
    });
}

export { get_token };
