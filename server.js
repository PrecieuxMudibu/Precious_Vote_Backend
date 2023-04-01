import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

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


app.listen(port, () => {
    console.log(`The server is listening to the port ${port}`);
});
