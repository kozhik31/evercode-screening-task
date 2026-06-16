import express from 'express';
import request from 'supertest';
import {open} from 'sqlite';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';

import addressRouter from '../routes/address.router.js';
import {describe, test, expect, beforeAll, afterAll, beforeEach} from '@jest/globals';
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
        CREATE TABLE IF NOT EXISTS address
        (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            blockchain TEXT NOT NULL
        )
    `);

    app.use('/', addressRouter(db));
    app.use(errorHandler)
});

afterAll(async () => {
    if (db) {
        await db.close();
    }
});

describe('Address API Endpoints', () => {

    describe('JWT', () => {
        test('должен возвращать 401, если заголовок Authorization отсутствует', async () => {
            const response = await request(app)
                .post('/address')
                .send({
                    name: '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv',
                    blockchain: 'bitcoin'
                });

            expect(response.statusCode).toBe(401);
        });

        test('должен возвращать 403, если токен невалидный или просрочен', async () => {
            const response = await request(app)
                .post('/address')
                .set('Authorization', 'Bearer wrong-or-expired-token')
                .send({
                    name: '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv',
                    blockchain: 'bitcoin'
                });

            expect(response.statusCode).toBe(403);
        });
    });

    describe('POST /address', () => {
        test('должен успешно создать новый адрес', async () => {
            const res = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv',
                    blockchain: 'bitcoin'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name', '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv');
            expect(res.body).toHaveProperty('blockchain', 'bitcoin');
        });

        test('должен вернуть 400, если не переданы обязательные поля', async () => {
            const res = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Поля name и blockchain обязательны');
        });

        test('должен вернуть 400, если блокчейн не поддерживается', async () => {
            const res = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '0x0000000000000000000000000000000000000000',
                    blockchain: 'ethereum'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'ethereum не поддерживается');
        });
    });

    describe('GET /address/:id', () => {
        test('должен вернуть адрес по id', async () => {
            const createRes = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
                    blockchain: 'bitcoin'
                });

            const id = createRes.body.id;

            const res = await request(app)
                .get(`/address/${id}`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);

            expect(res.body).toHaveProperty('id', String(id));
            expect(res.body).toHaveProperty('name', '1BoatSLRHtKNngkdXEeobR76b53LETtpyT');
            expect(res.body).toHaveProperty('blockchain', 'bitcoin');
        });

        test('должен вернуть 404, если адрес не найден', async () => {
            const res = await request(app)
                .get('/address/999999')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PUT /address', () => {
        test('должен успешно обновить существующий адрес', async () => {
            const createRes = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1OldBitcoinAddress111111111111111111',
                    blockchain: 'bitcoin'
                });

            const addressId = createRes.body.id;

            const res = await request(app)
                .put('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    id: addressId,
                    name: '1NewBitcoinAddress111111111111111111',
                    blockchain: 'bitcoin'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id', addressId);
            expect(res.body).toHaveProperty('name', '1NewBitcoinAddress111111111111111111');
            expect(res.body).toHaveProperty('blockchain', 'bitcoin');
        });

        test('должен вернуть 400, если не передан id, name или blockchain', async () => {
            const res = await request(app)
                .put('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1BitcoinAddress111111111111111111'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Поля name и blockchain обязательны');
        });

        test('должен вернуть 400, если блокчейн не поддерживается при обновлении', async () => {
            const createRes = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1BitcoinAddress222222222222222222',
                    blockchain: 'bitcoin'
                });

            const addressId = createRes.body.id;

            const res = await request(app)
                .put('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    id: addressId,
                    name: '1BitcoinAddress222222222222222222',
                    blockchain: 'ethereum'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'ethereum не поддерживается');
        });
    });

    describe('DELETE /address/:id', () => {
        test('должен удалить адрес по id и вернуть статус 204', async () => {
            const createRes = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1DeleteBitcoinAddress111111111111111',
                    blockchain: 'bitcoin'
                });

            const addressId = createRes.body.id;

            const res = await request(app)
                .delete(`/address/${addressId}`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(204);
            expect(res.body).toEqual({});
        });

        test('после удаления адрес должен возвращать 404', async () => {
            const createRes = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1DeleteCheckBitcoinAddress111111',
                    blockchain: 'bitcoin'
                });

            const addressId = createRes.body.id;

            await request(app)
                .delete(`/address/${addressId}`)
                .set('Authorization', `Bearer ${validToken}`);

            const res = await request(app)
                .get(`/address/${addressId}`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('GET /address/:id/blockchain-height', () => {
        test('должен вернуть высоту блокчейна для адреса', async () => {
            const createRes = await request(app)
                .post('/address')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: '1HeightBitcoinAddress11111111111111',
                    blockchain: 'bitcoin'
                });

            const addressId = createRes.body.id;

            const res = await request(app)
                .get(`/address/${addressId}/blockchain-height`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('blockchain', 'bitcoin');
            expect(res.body).toHaveProperty('height');

            expect(typeof res.body.height).toBe('number');
        });

        test('должен вернуть 404, если адрес для получения высоты не найден', async () => {
            const res = await request(app)
                .get('/address/999999/blockchain-height')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });
});