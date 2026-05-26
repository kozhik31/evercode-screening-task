import express from 'express';
import {verifyToken} from '../middleware/jwt.js'

const router = express.Router();


/**
 * @openapi
 * /status:
 *   get:
 *     summary: Получить статус работы сервера
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Сервер работает корректно
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: ok
 */
router.get('/status', verifyToken, function (req, res) {
    res.send('ok');
});

export default router