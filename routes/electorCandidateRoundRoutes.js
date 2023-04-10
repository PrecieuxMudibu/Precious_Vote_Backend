import express from 'express';
import {
    delete_all_ElectorCandidateRound,
    get_history_of_ElectorCandidateRound,
    get_ElectorCandidateRound_of_the_candidates
} from '../controllers/electorCandidateRoundControllers.js';

const router = express.Router();

router.get(
    '/get_history_of_ElectorCandidateRound/:round_id',
    get_history_of_ElectorCandidateRound
);

router.get(
    '/get_ElectorCandidateRound_of_the_candidates',
    get_ElectorCandidateRound_of_the_candidates
);

router.delete(
    '/delete_all_ElectorCandidateRound',
    delete_all_ElectorCandidateRound
);

export default router;
