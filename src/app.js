import 'dotenv/config';
import express from 'express';
import statusRouter from './routes/status.js'
import currencyRouter from './routes/currency.js'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


const app = express();
const port = 3000;

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

app.use('/', currencyRouter)
app.use('/', statusRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});