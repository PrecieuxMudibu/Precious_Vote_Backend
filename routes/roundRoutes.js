import express from 'express';
import {
    create_round,
    start_round,
    close_round,
} from '../controllers/roundControllers.js';

const router = express.Router();

router.post('/create_round', create_round);
router.put('/start_round/:round_id', start_round);
router.put('/close_round/:round_id', close_round);

export default router;
