import express from 'express';
import { get_electors, update_elector } from '../controllers/electorControllers.js';

const router = express.Router();

router.put('/update_elector/:elector_id', update_elector);
router.get('/get_electors/:election_id', get_electors);

export default router;
