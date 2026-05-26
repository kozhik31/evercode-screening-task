import 'dotenv/config';
import express from 'express';
import statusRouter from './routes/status.js'
import currencyRouter from './routes/currency.js'


const app = express();
const port = 3000;


app.use(express.json())


app.use('/', currencyRouter)
app.use('/', statusRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});