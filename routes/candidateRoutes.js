import express from 'express';
import {
    get_candidates,
    vote_candidate,
} from '../controllers/candidateControllers.js';

const router = express.Router();

router.get('/get_candidates/:election_id/:post_id', get_candidates);
router.post('/vote_candidate', vote_candidate);

export default router;
