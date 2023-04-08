import express from 'express';
import { delete_all_ElectorCandidateRound } from '../controllers/electorCandidateRoundControllers.js';

const router = express.Router();

router.delete(
    '/delete_all_ElectorCandidateRound',
    delete_all_ElectorCandidateRound
);

export default router;
