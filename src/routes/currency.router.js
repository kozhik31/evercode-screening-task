import express from 'express';
import CurrencyService from '../services/currency.service.js'

function currencyRouter(db) {

    const router = express.Router();
    const currencyService = new CurrencyService(db)

    /**
     * @openapi
     * components:
     *   schemas:
     *     Currency:
     *       type: object
     *       required:
     *         - name
     *         - ticker
     *       properties:
     *         name:
     *           type: string
     *           description: Полное название валюты
     *           example: Bitcoin
     *         ticker:
     *           type: string
     *           description: Уникальный тикер валюты
     *           example: BTC
     *     Error:
     *       type: object
     *       properties:
     *         error:
     *           type: string
     *           example: Сообщение об ошибке
     */

    /**
     * @openapi
     * /currency/{id}:
     *   get:
     *     summary: Получить валюту по id
     *     tags: [Currency]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: id валюты
     *         example: 1
     *     responses:
     *       200:
     *         description: Успешный ответ с объектом валюты
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Currency'
     *       404:
     *         description: Валюта не найдена
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.get('/currency/:id', async function (req, res) {
        try {
            const {id} = req.params;
            const currency = await currencyService.getCurrencyById(id);
            res.status(200).json(currency);
        } catch (error) {
            res.status(404).json({error: error.message});
        }
    });


    /**
     * @openapi
     * /currency/{id}:
     *   delete:
     *     summary: Удалить валюту по ID
     *     tags: [Currency]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Идентификатор удаляемой валюты
     *         example: "1"
     *     responses:
     *       204:
     *         description: Валюта успешно удалена, контент отсутствует
     *       404:
     *         description: Валюта не найдена
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.delete('/currency/:id', async function (req, res) {
        try {
            const {id} = req.params;
            await currencyService.deleteCurrency(id);
            res.status(204).end();
        } catch (error) {
            res.status(404).json({error: error.message});
        }
    });


    /**
     * @openapi
     * /currency:
     *   post:
     *     summary: Создать новую валюту
     *     tags: [Currency]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Currency'
     *     responses:
     *       201:
     *         description: Валюта успешно создана
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Currency'
     *       400:
     *         description: Ошибка валидации или валюта уже существует
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.post('/currency', async function (req, res) {
        try {
            const {name, ticker} = req.body;

            if (!name || !ticker) {
                return res.status(400).json({error: 'Поля name и ticker обязательны'});
            }

            const newCurrency = await currencyService.addCurrency(name, ticker);
            res.status(201).json(newCurrency);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    });


    /**
     * @openapi
     * /currency:
     *   put:
     *     summary: Обновить существующую валюту
     *     tags: [Currency]
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
     *                 type: string
     *                 description: Идентификатор валюты
     *                 example: "1"
     *               name:
     *                 type: string
     *                 description: Полное название валюты
     *                 example: Bitcoin
     *               ticker:
     *                 type: string
     *                 description: Уникальный тикер валюты
     *                 example: BTC
     *     responses:
     *       200:
     *         description: Валюта успешно обновлена
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Currency'
     *       400:
     *         description: Не удалось обновить валюту
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.put('/currency', async function (req, res) {
        try {
            const {id, name, ticker} = req.body;

            if (!id || !name || !ticker) {
                return res.status(400).json({error: 'Поля id, name и ticker обязательны'});
            }

            const newCurrency = await currencyService.updateCurrency(id, name, ticker);
            res.status(200).json(newCurrency);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    });


    /**
     * @openapi
     * /price:
     *   get:
     *     summary: Получить актуальные цены для валют по их имени
     *     tags: [Price]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *                 description: Имя валюты для поиска совпадений
     *                 example: Bitcoin
     *     responses:
     *       200:
     *         description: Список цен для найденных валют
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 description: Объект цены, возвращаемый PriceService
     *       400:
     *         description: Отсутствует обязательное поле name
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Валюта с таким именем не найдена в базе
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.get('/price', async function (req, res) {
        try {
            const {name} = req.body;
            if (!name) {
                return res.status(400).json({error: 'Нужно передать name'});
            }

            const currencies = await currencyService.getCurrencyByName(name);

            res.status(200).json(currencies);
        } catch (error) {
            res.status(404).json({error: error.message});
        }
    });

    return router
}

export default currencyRouter