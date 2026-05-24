import express from 'express';
import request from 'supertest';
import { test, expect } from '@jest/globals';
import statusRouter from '../routes/status.js';

test('должен возвращать ok на /status', async () => {
    const app = express();
    app.use('/', statusRouter);

    const response = await request(app).get('/status');

    expect(response.text).toBe('ok')
})
