import express from 'express';
import {
    register,
    login,
    get_user,
    update_user,
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get_user/:_id', get_user);
router.put('/update_user/:_id', update_user);

export default router;
