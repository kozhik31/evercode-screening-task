import 'dotenv/config';
import express from 'express';
import statusRouter from './routes/status.js'
import currencyRouter from './routes/currency.router.js'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import createTables from "./repositories/create_tables.js";
import initDatabase from "./repositories/init.js";
import TaskScheduler from "./services/taskScheduler.js";
import PriceService from "./services/price.js";

const app = express();
const port = 3000;


const db = await initDatabase()
await createTables(db)

const taskScheduler = new TaskScheduler()
const priceService = new PriceService(db)
await taskScheduler.addTask(priceService.updatePrices.bind(priceService), 60000)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Currency Service API',
            version: '1.0.0',
            description: 'API для управления валютами и проверки статуса приложения',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);


app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', currencyRouter(db))
app.use('/', statusRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


async function exit() {
    await taskScheduler.clearTasks()
    await db.close()
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);