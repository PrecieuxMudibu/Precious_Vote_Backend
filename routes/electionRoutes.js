import express from 'express';
import {
    create_election,
    get_elections_of_the_current_user,
} from '../controllers/electionControllers.js';

const router = express.Router();

router.post('/create_election', create_election);
router.get(
    '/get_elections_of_the_current_user/:user_id',
    get_elections_of_the_current_user
);

export default router;
