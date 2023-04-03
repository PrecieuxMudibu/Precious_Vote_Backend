import express from 'express';
import { get_candidates } from '../controllers/candidateControllers.js';

const router = express.Router();

router.get('/get_candidates/:election_id/:post_id', get_candidates);

export default router;
