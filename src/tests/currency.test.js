import express from 'express';
import request from 'supertest';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import currencyRouter from '../routes/currency.router.js';
import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";

const app = express();
app.use(express.json());

let db;

beforeAll(async () => {
    db = await open({
        filename: ':memory:',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS currency (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ticker TEXT NOT NULL
        )
    `);

    app.use('/', currencyRouter(db));
});

afterAll(async () => {
    if (db) {
        await db.close();
    }
});

describe('Currency API Endpoints', () => {

    describe('POST /currency', () => {
        test('должен успешно создать новую валюту', async () => {
            const res = await request(app)
                .post('/currency')
                .send({ name: 'Bitcoin', ticker: 'BTC' });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('name', 'Bitcoin');
            expect(res.body).toHaveProperty('ticker', 'BTC');
            expect(res.body).toHaveProperty('id'); // Теперь база вернет реальный ID
        });

        test('должен вернуть 400, если не переданы обязательные поля', async () => {
            const res = await request(app)
                .post('/currency')
                .send({ name: 'Ethereum' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Поля name и ticker обязательны');
        });
    });

    describe('GET /currency/:name', () => {
        test('должен вернуть валюту по её id', async () => {
            const currency = await request(app)
                .post('/currency')
                .send({ name: 'Solana', ticker: 'SOL' });

            const id = currency.body.id
            const res = await request(app).get(`/currency/${id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Solana');

        });

        test('должен вернуть 404, если валюта не найдена', async () => {
            const res = await request(app).get('/currency/NotExists');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PUT /currency', () => {
        test('должен успешно обновить существующую валюту', async () => {
            const createRes = await request(app)
                .post('/currency')
                .send({ name: 'Tether', ticker: 'USD' });

            const currencyId = createRes.body.id; // Берем настоящий ID из базы

            const res = await request(app)
                .put('/currency')
                .send({ id: currencyId, name: 'Tether', ticker: 'USDT' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('ticker', 'USDT');
        });

        test('должен вернуть 400, если не передан id, name или ticker', async () => {
            const res = await request(app)
                .put('/currency')
                .send({ name: 'Bitcoin' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Поля id, name и ticker обязательны');
        });
    });

    describe('DELETE /currency/:id', () => {
        test('должен удалить валюту по id и вернуть статус 204', async () => {
            const createRes = await request(app)
                .post('/currency')
                .send({ name: 'Dogecoin', ticker: 'DOGE' });

            const currencyId = createRes.body.id;

            const res = await request(app).delete(`/currency/${currencyId}`);

            expect(res.status).toBe(204);
            expect(res.body).toEqual({});
        });
    });
});
