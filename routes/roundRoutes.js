import express from 'express';
import { create_round } from '../controllers/roundControllers.js';

const router = express.Router();

router.post('/create_round', create_round);

export default router;
