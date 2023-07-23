import express from 'express';
import { send_emails_to_all } from '../controllers/emailControllers.js';

const router = express.Router();

router.post('/send_emails_to_all_electors', send_emails_to_all);

export default router;
