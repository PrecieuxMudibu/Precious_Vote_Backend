import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import bodyParser from 'body-parser';
import auth_middleware from './middlewares/passport.js';

import userRoutes from './routes/userRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

mongoose
    .connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connection to MongoDB done'))
    .catch((error) => console.log('Error Connecting to the Database', error));

app.use(passport.initialize());
app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', electionRoutes);
app.use('/api', postRoutes);

app.listen(port, () => {
    console.log(`The server is listening to the port ${port}`);
});