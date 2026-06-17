import express from 'express';
import request from 'supertest';
import {open} from 'sqlite';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';

import currencyRouter from '../routes/currency.router.js';
import {describe, expect, test, beforeAll, afterAll, beforeEach} from "@jest/globals";
import {errorHandler} from "../middleware/errorHandler.js";

const TEST_SECRET = '8f4e2c6a1b3d5e7f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f';

const app = express();
app.use(express.json());

let db;
let validToken;

beforeEach(() => {
    process.env.JWT = TEST_SECRET;

    validToken = jwt.sign(
        {userId: 123},
        TEST_SECRET,
        {expiresIn: '1h'}
    );
});

beforeAll(async () => {
    process.env.JWT = TEST_SECRET;

    db = await open({
        filename: ':memory:',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS currency
        (
            id     INTEGER PRIMARY KEY AUTOINCREMENT,
            name   TEXT NOT NULL,
            ticker TEXT NOT NULL,
            price REAL
        )
    `);

    app.use('/', currencyRouter(db));
    app.use(errorHandler)
});

afterAll(async () => {
    if (db) {
        await db.close();
    }
});

describe('Currency API Endpoints', () => {

    describe('JWT', () => {
        test('должен возвращать 401, если заголовок Authorization отсутствует', async () => {
            const response = await request(app)
                .post('/currency')
                .send({name: 'Bitcoin', ticker: 'BTC'});

            expect(response.statusCode).toBe(401);
        });

        test('должен возвращать 403, если токен невалидный или просрочен', async () => {
            const response = await request(app)
                .post('/currency')
                .set('Authorization', 'Bearer wrong-or-expired-token')
                .send({name: 'Bitcoin', ticker: 'BTC'});

            expect(response.statusCode).toBe(403);
        });
    });

    describe('POST /currency', () => {
        test('должен успешно создать новую валюту', async () => {
            const res = await request(app)
                .post('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({name: 'Bitcoin', ticker: 'BTC'});

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('name', 'Bitcoin');
            expect(res.body).toHaveProperty('ticker', 'BTC');
            expect(res.body).toHaveProperty('id');
        });

        test('должен вернуть 400, если не переданы обязательные поля', async () => {
            const res = await request(app)
                .post('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({name: 'Ethereum'});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Поля name и ticker обязательны');
        });
    });

    describe('GET /currency/:id', () => {
        test('должен вернуть валюту по её id', async () => {
            const currency = await request(app)
                .post('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({name: 'Solana', ticker: 'SOL'});

            const id = currency.body.id;

            const res = await request(app)
                .get(`/currency/${id}`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id', String(id));
            expect(res.body).toHaveProperty('name', 'Solana');
            expect(res.body).toHaveProperty('ticker', 'SOL');
        });

        test('должен вернуть 404, если валюта не найдена', async () => {
            const res = await request(app)
                .get('/currency/999999')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PUT /currency', () => {
        test('должен успешно обновить существующую валюту', async () => {
            const createRes = await request(app)
                .post('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({name: 'Tether', ticker: 'USD'});

            const currencyId = createRes.body.id;

            const res = await request(app)
                .put('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    id: currencyId,
                    name: 'Tether',
                    ticker: 'USDT'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id', currencyId);
            expect(res.body).toHaveProperty('name', 'Tether');
            expect(res.body).toHaveProperty('ticker', 'USDT');
        });

        test('должен вернуть 400, если не передан id, name или ticker', async () => {
            const res = await request(app)
                .put('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({name: 'Bitcoin'});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Поля id, name и ticker обязательны');
        });
    });

    describe('DELETE /currency/:id', () => {
        test('должен удалить валюту по id и вернуть статус 204', async () => {
            const createRes = await request(app)
                .post('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({name: 'Dogecoin', ticker: 'DOGE'});

            const currencyId = createRes.body.id;

            const res = await request(app)
                .delete(`/currency/${currencyId}`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(204);
            expect(res.body).toEqual({});
        });
    });

    describe('GET /price/:name', () => {
        test('должен вернуть все цены валют по имени', async () => {
            await request(app)
                .post('/currency')
                .set('Authorization', `Bearer ${validToken}`)
                .send({name: 'USD', ticker: 'BTCUSD'});

            const res = await request(app)
                .get('/price/USD')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('ticker');
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('price');
        });

        test('должен вернуть 404, если валюта не найдена', async () => {
            const res = await request(app)
                .get('/price/aaaaaaaaaaaaaaaa')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});