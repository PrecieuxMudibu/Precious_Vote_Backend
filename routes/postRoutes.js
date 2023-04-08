import express from 'express';
import { create_post } from '../controllers/postControllers.js';

const router = express.Router();

router.post('/create_post', create_post);

export default router;
