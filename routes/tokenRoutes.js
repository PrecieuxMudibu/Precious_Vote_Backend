import express from 'express';
import { get_token } from '../controllers/tokenControllers.js';

const router = express.Router();

router.get('/get_token', get_token);

export default router;
