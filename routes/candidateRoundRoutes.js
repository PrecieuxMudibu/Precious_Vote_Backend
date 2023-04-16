import express from 'express';
import { get_candidates_for_the_round } from '../controllers/candidateRoundControllers.js';

const router = express.Router();

router.get(
    '/get_candidates_for_the_round/:round_id',
    get_candidates_for_the_round
);

export default router;
