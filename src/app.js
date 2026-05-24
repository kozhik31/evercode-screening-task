import express from 'express';
import statusRouter from './routes/status.js'

const app = express();
const port = 3000;

app.use('/', statusRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});