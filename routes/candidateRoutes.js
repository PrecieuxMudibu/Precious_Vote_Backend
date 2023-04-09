import express from 'express';
import {
    get_all_candidates_for_the_post,
    vote_candidate,
} from '../controllers/candidateControllers.js';

const router = express.Router();

router.get('/get_all_candidates_for_the_post/:post_id', get_all_candidates_for_the_post);
router.post('/vote_candidate', vote_candidate);

export default router;
