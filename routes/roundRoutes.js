import express from 'express';
import {
    create_round,
    start_round,
    close_round,
    get_rounds_for_a_post,
    delete_all_rounds,
} from '../controllers/roundControllers.js';

const router = express.Router();

router.post('/create_round', create_round);
router.put('/start_round/:round_id', start_round);
router.put('/close_round/:round_id', close_round);
router.get('/get_rounds_for_a_post/:post_id', get_rounds_for_a_post);
router.delete('/delete_all_rounds', delete_all_rounds);

export default router;
