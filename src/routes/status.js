import express from 'express';
import {verifyToken} from '../middleware/jwt.js'

const router = express.Router();
router.use(verifyToken)

/**
 * @openapi
 * tags:
 *   - name: Status
 *     description: Проверка состояния сервера
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Получить статус работы сервера
 *     description: Проверяет, что сервер запущен и доступен для авторизованного пользователя.
 *     tags: [Status]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Сервер работает корректно
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: ok
 *       401:
 *         description: Пользователь не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/status', function (req, res) {
    res.send('ok');
});

export default router