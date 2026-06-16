import express from 'express';
import CurrencyService from '../services/currency.service.js';
import { BadRequestError } from "../errors/errors.js";
import { verifyToken } from '../middleware/jwt.js';

function currencyRouter(db) {
    const router = express.Router();
    const currencyService = new CurrencyService(db);
    router.use(verifyToken);

    /**
     * @openapi
     * /currency/{id}:
     *   get:
     *     summary: Получить валюту по ID
     *     description: Возвращает информацию о валюте по ее идентификатору.
     *     tags: [Currency]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID валюты
     *         example: 1
     *     responses:
     *       200:
     *         description: Валюта успешно найдена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: Bitcoin
     *                 ticker:
     *                   type: string
     *                   example: BTC
     *       400:
     *         description: Некорректный запрос
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Некорректный запрос
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Токен не передан
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Недействительный токен
     *       404:
     *         description: Валюта не найдена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Валюта не найдена
     */
    router.get('/currency/:id', async function (req, res) {
        const { id } = req.params;
        const currency = await currencyService.getCurrencyById(id);
        res.status(200).json(currency);
    });

    /**
     * @openapi
     * /currency/{id}/history:
     *   get:
     *     summary: Получить историю цены валюты
     *     description: Получает валюту по ID и возвращает историю цены по ее тикеру.
     *     tags: [Price]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID валюты
     *         example: 1
     *       - in: query
     *         name: interval
     *         required: false
     *         schema:
     *           type: string
     *           default: 1d
     *           enum: [1m, 5m, 15m, 1h, 4h, 1d, 1w]
     *         description: Интервал истории цены
     *         example: 1d
     *     responses:
     *       200:
     *         description: История цены успешно получена
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   openTime:
     *                     type: integer
     *                     example: 1718208000000
     *                   open:
     *                     type: string
     *                     example: "67000.00"
     *                   high:
     *                     type: string
     *                     example: "68100.00"
     *                   low:
     *                     type: string
     *                     example: "66500.00"
     *                   close:
     *                     type: string
     *                     example: "67420.15"
     *       400:
     *         description: Некорректный запрос или неподдерживаемый интервал
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Некорректный интервал
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Токен не передан
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Недействительный токен
     *       404:
     *         description: Валюта не найдена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Валюта не найдена
     */
    router.get('/currency/:id/history', async function (req, res) {
        const { id } = req.params;
        const interval = req.query.interval || "1d";
        const currency = await currencyService.getCurrencyById(id);
        const history = await currencyService.getHistory(currency.ticker, interval);

        res.status(200).json(history);
    });

    /**
     * @openapi
     * /currency/{id}:
     *   delete:
     *     summary: Удалить валюту по ID
     *     description: Удаляет валюту из списка отслеживаемых валют.
     *     tags: [Currency]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID валюты
     *         example: 1
     *     responses:
     *       204:
     *         description: Валюта успешно удалена, тело ответа отсутствует
     *       400:
     *         description: Некорректный запрос
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Некорректный запрос
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Токен не передан
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Недействительный токен
     *       404:
     *         description: Валюта не найдена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Валюта не найдена
     */
    router.delete('/currency/:id', async function (req, res) {
        const { id } = req.params;
        await currencyService.deleteCurrency(id);
        res.status(204).end();
    });

    /**
     * @openapi
     * /currency:
     *   post:
     *     summary: Создать новую валюту
     *     description: Добавляет новую криптовалюту в список отслеживаемых.
     *     tags: [Currency]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - ticker
     *             properties:
     *               name:
     *                 type: string
     *                 description: Полное название валюты
     *                 example: Bitcoin
     *               ticker:
     *                 type: string
     *                 description: Тикер валюты
     *                 example: BTC
     *     responses:
     *       201:
     *         description: Валюта успешно создана
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: Bitcoin
     *                 ticker:
     *                   type: string
     *                   example: BTC
     *       400:
     *         description: Ошибка валидации или валюта уже существует
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Поля name и ticker обязательны
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Токен не передан
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Недействительный токен
     *       404:
     *         description: Связанный ресурс не найден
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Ресурс не найден
     */
    router.post('/currency', async function (req, res) {
        const { name, ticker } = req.body;

        if (!name || !ticker) {
            throw new BadRequestError("Поля name и ticker обязательны");
        }

        const newCurrency = await currencyService.addCurrency(name, ticker);
        res.status(201).json(newCurrency);
    });

    /**
     * @openapi
     * /currency:
     *   put:
     *     summary: Обновить существующую валюту
     *     description: Обновляет название и тикер существующей валюты.
     *     tags: [Currency]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - id
     *               - name
     *               - ticker
     *             properties:
     *               id:
     *                 type: integer
     *                 description: ID валюты
     *                 example: 1
     *               name:
     *                 type: string
     *                 description: Полное название валюты
     *                 example: Bitcoin
     *               ticker:
     *                 type: string
     *                 description: Тикер валюты
     *                 example: BTC
     *     responses:
     *       200:
     *         description: Валюта успешно обновлена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: Bitcoin
     *                 ticker:
     *                   type: string
     *                   example: BTC
     *       400:
     *         description: Не переданы обязательные поля или операция ничего не изменяет
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Поля id, name и ticker обязательны
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Токен не передан
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Недействительный токен
     *       404:
     *         description: Валюта не найдена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Валюта не найдена
     */
    router.put('/currency', async function (req, res) {
        const { id, name, ticker } = req.body;

        if (!id || !name || !ticker) {
            throw new BadRequestError("Поля id, name и ticker обязательны");
        }

        const newCurrency = await currencyService.updateCurrency(id, name, ticker);
        res.status(200).json(newCurrency);
    });

    /**
     * @openapi
     * /price/{name}:
     *   get:
     *     summary: Получить актуальную цену валюты по имени
     *     description: Ищет валюту по имени и возвращает актуальную цену или список цен.
     *     tags: [Price]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: name
     *         required: true
     *         schema:
     *           type: string
     *         description: Название валюты
     *         example: Bitcoin
     *     responses:
     *       200:
     *         description: Цена успешно получена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 symbol:
     *                   type: string
     *                   example: BTCUSDT
     *                 price:
     *                   type: string
     *                   example: "67420.15"
     *       400:
     *         description: Некорректный запрос
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Некорректный запрос
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Токен не передан
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Недействительный токен
     *       404:
     *         description: Валюта с таким именем не найдена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Валюта не найдена
     */
    router.get('/price/:name', async function (req, res) {
        const { name } = req.params;
        const currencies = await currencyService.getCurrencyByName(name);
        res.status(200).json(currencies);
    });

    return router;
}

export default currencyRouter;