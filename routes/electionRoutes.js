import express from 'express';
import { create_election } from '../controllers/electionControllers.js';

const router = express.Router();

router.post('/create_election', create_election);

export default router;
