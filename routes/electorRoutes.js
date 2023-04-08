import express from 'express';
import { update_elector } from '../controllers/electorControllers.js';

const router = express.Router();

router.put('/update_elector/:elector_id', update_elector);

export default router;
