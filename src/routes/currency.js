import express from 'express';
import CurrencyService from '../services/currency.js'

const router = express.Router();
const currencyService = new CurrencyService()


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
 * /currency/{name}:
 *   get:
 *     summary: Получить валюту по имени
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя валюты
 *         example: Bitcoin
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
router.get('/currency/:name', function (req, res) {
    try {
        const {name} = req.params;
        const currency = currencyService.getCurrencyByName(name);
        res.status(200).json(currency);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});


/**
 * @openapi
 * /currency/{name}:
 *   delete:
 *     summary: Удалить валюту по имени
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя удаляемой валюты
 *     responses:
 *       204:
 *         description: Валюта успешно удалена, контент отсутствует
 */
router.delete('/currency/:name', function (req, res) {
    const {name} = req.params;
    currencyService.deleteCurrency(name);
    res.status(204).end();
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
router.post('/currency', function (req, res) {
    try {
        const {name, ticker} = req.body;

        if (!name || !ticker) {
            return res.status(400).json({error: 'Поля name и ticker обязательны'});
        }

        const newCurrency = currencyService.addCurrency(name, ticker);
        res.status(201).json(newCurrency);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


/**
 * @openapi
 * /currency:
 *   patch:
 *     summary: Обновить существующую валюту
 *     tags: [Currency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Currency'
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
router.patch('/currency', function (req, res) {
    try {
        const {name, ticker} = req.body;

        if (!name || !ticker) {
            return res.status(400).json({error: 'Поля name и ticker обязательны'});
        }

        const newCurrency = currencyService.updateCurrency(name, ticker);
        res.status(200).json(newCurrency);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


export default router