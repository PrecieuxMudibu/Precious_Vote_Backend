import express from 'express';
import {
    create_election,
    get_elections_of_the_current_user,
    get_an_election,
} from '../controllers/electionControllers.js';

const router = express.Router();

router.post('/create_election', create_election);
router.get(
    '/get_elections_of_the_current_user/:user_id',
    get_elections_of_the_current_user
);
router.get('/get_an_election/:election_id', get_an_election);

export default router;
