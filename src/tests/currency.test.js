import express from 'express';
import request from 'supertest';
import currencyRouter from '../routes/currency.js';
import {describe, expect, test} from "@jest/globals";


const app = express();
app.use(express.json());
app.use('/', currencyRouter);

describe('Currency API Endpoints', () => {

    describe('POST /currency', () => {
        test('должен успешно создать новую валюту', async () => {
            const res = await request(app)
                .post('/currency')
                .send({name: 'Bitcoin', ticker: 'BTC'});

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('name', 'Bitcoin');
            expect(res.body).toHaveProperty('ticker', 'BTC');
        });

        test('должен вернуть 400, если не переданы обязательные поля', async () => {
            const res = await request(app)
                .post('/currency')
                .send({name: 'Ethereum'}); // Пропустили ticker

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Поля name и ticker обязательны');
        });
    });

    describe('GET /currency/:name', () => {
        test('должен вернуть валюту по её имени', async () => {
            // Сначала создаем валюту, чтобы она точно была в памяти сервиса
            await request(app)
                .post('/currency')
                .send({name: 'Solana', ticker: 'SOL'});

            const res = await request(app).get('/currency/Solana');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Solana');
            expect(res.body).toHaveProperty('ticker', 'SOL');
        });

        test('должен вернуть 404, если валюта не найдена', async () => {
            const res = await request(app).get('/currency/NotExists');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PATCH /currency', () => {
        test('должен успешно обновить существующую валюту', async () => {
            await request(app)
                .post('/currency')
                .send({name: 'Tether', ticker: 'USD'});

            const res = await request(app)
                .patch('/currency')
                .send({name: 'Tether', ticker: 'USDT'});

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('ticker', 'USDT');
        });

        test('должен вернуть 400 при попытке обновить несуществующую валюту', async () => {
            const res = await request(app)
                .patch('/currency')
                .send({name: 'UnknownCoin', ticker: 'UNK'});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('DELETE /currency/:name', () => {
        test('должен удалить валюту и вернуть статус 204', async () => {
            // Создаем
            await request(app)
                .post('/currency')
                .send({name: 'Dogecoin', ticker: 'DOGE'});

            const res = await request(app).delete('/currency/Dogecoin');

            expect(res.status).toBe(204);
            expect(res.body).toEqual({});

            const getRes = await request(app).get('/currency/Dogecoin');
            expect(getRes.status).toBe(404);
        });
    });
});
