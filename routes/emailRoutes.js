import express from 'express';
import { send_email } from '../controllers/emailControllers.js';

const router = express.Router();

router.post('/send_email', send_email);

export default router;
