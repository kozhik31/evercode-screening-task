import express from 'express';
import request from 'supertest';
import {test, expect, beforeEach} from '@jest/globals';
import statusRouter from '../routes/status.js';
import jwt from "jsonwebtoken";

const TEST_SECRET = '8f4e2c6a1b3d5e7f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f';


beforeEach(() => {
    process.env.JWT = TEST_SECRET;
});

test('должен возвращать 401, если заголовок Authorization отсутствует', async () => {
    const app = express();
    app.use('/', statusRouter);

    const response = await request(app).get('/status');

    expect(response.statusCode).toBe(401);
});

test('должен возвращать 403, если токен невалидный или просрочен', async () => {
    const app = express();
    app.use('/', statusRouter);

    const response = await request(app)
        .get('/status')
        .set('Authorization', 'Bearer wrong-or-expired-token');

    expect(response.statusCode).toBe(403);
});

test('должен возвращать ok на /status с верным токеном', async () => {
    const app = express();
    app.use('/', statusRouter);

    const validToken = jwt.sign({userId: 123}, TEST_SECRET, {expiresIn: '1h'});

    const response = await request(app)
        .get('/status')
        .set('Authorization', `Bearer ${validToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('ok')
})
