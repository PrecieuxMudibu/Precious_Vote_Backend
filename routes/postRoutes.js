import express from 'express';
import { create_post, get_posts_for_an_election } from '../controllers/postControllers.js';

const router = express.Router();

router.get('/get_posts_for_an_election', get_posts_for_an_election);
router.post('/create_post', create_post);

export default router;
