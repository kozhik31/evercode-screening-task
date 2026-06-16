import express from "express";
import AddressService from "../services/address.service.js";
import {BadRequestError} from "../errors/errors.js";
import {verifyToken} from "../middleware/jwt.js";

function addressRouter(db) {

    const router = express.Router();
    const addressService = new AddressService(db);
    const supportedBlockchains = ['bitcoin']
    router.use(verifyToken)

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Управление отслеживаемыми адресами блокчейна
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


    /**
     * @openapi
     * /address/{id}:
     *   get:
     *     summary: Получить адрес по ID
     *     description: Возвращает информацию об отслеживаемом адресе.
     *     tags: [Address]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID адреса
     *         example: 1
     *     responses:
     *       200:
     *         description: Адрес успешно найден
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
     *                   example: "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv"
     *                 blockchain:
     *                   type: string
     *                   example: bitcoin
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
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Адрес не найден
     */
    router.get('/address/:id', async function (req, res) {
        const {id} = req.params;
        const address = await addressService.getAddressById(id);
        res.status(200).json(address);
    });


    /**
     * @openapi
     * /address/{id}/blockchain-height:
     *   get:
     *     summary: Получить текущую высоту блокчейна
     *     description: Получает адрес по ID, определяет его блокчейн и возвращает текущую высоту блокчейна.
     *     tags: [Address]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID адреса
     *         example: 1
     *     responses:
     *       200:
     *         description: Высота блокчейна успешно получена
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 blockchain:
     *                   type: string
     *                   example: bitcoin
     *                 height:
     *                   type: integer
     *                   example: 848000
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
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Адрес не найден
     */
    router.get('/address/:id/blockchain-height', async function (req, res) {
        const {id} = req.params;
        const address = await addressService.getAddressById(id);
        const height = await addressService.getBlockHeight(address.blockchain);
        const result = {blockchain: address.blockchain, height: height}
        res.status(200).json(result);
    });


    /**
     * @openapi
     * /address:
     *   post:
     *     summary: Добавить новый адрес
     *     description: Создает новый отслеживаемый адрес для поддерживаемого блокчейна.
     *     tags: [Address]
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
     *               - blockchain
     *             properties:
     *               name:
     *                 type: string
     *                 example: "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv"
     *               blockchain:
     *                 type: string
     *                 example: bitcoin
     *     responses:
     *       201:
     *         description: Адрес успешно создан
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
     *                   example: "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv"
     *                 blockchain:
     *                   type: string
     *                   example: bitcoin
     *       400:
     *         description: Не переданы обязательные поля или блокчейн не поддерживается
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Поля name и blockchain обязательны
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
    router.post('/address', async function (req, res) {
        const {name, blockchain} = req.body;

        if (!name || !blockchain) {
            throw new BadRequestError("Поля name и blockchain обязательны");
        }
        if (!supportedBlockchains.includes(blockchain)) {
            throw new BadRequestError(`${blockchain} не поддерживается`);
        }


        const newAddress = await addressService.addAddress(name, blockchain);
        res.status(201).json(newAddress);
    });

    /**
     * @openapi
     * /address:
     *   put:
     *     summary: Обновить адрес
     *     description: Обновляет данные существующего отслеживаемого адреса.
     *     tags: [Address]
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
     *               - blockchain
     *             properties:
     *               id:
     *                 type: integer
     *                 example: 1
     *               name:
     *                 type: string
     *                 example: "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv"
     *               blockchain:
     *                 type: string
     *                 example: bitcoin
     *     responses:
     *       200:
     *         description: Адрес успешно обновлен
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
     *                   example: "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv"
     *                 blockchain:
     *                   type: string
     *                   example: bitcoin
     *       400:
     *         description: Не переданы обязательные поля или блокчейн не поддерживается
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Поля id, name и blockchain обязательны
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
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Адрес не найден
     */
    router.put('/address', async function (req, res) {
        const {id, name, blockchain} = req.body;

        if (!id || !name || !blockchain) {
            throw new BadRequestError("Поля name и blockchain обязательны");
        }
        if (!supportedBlockchains.includes(blockchain)) {
            throw new BadRequestError(`${blockchain} не поддерживается`);
        }

        const newAddress = await addressService.updateAddress(id, name, blockchain);
        res.status(200).json(newAddress);
    });

    /**
     * @openapi
     * /address/{id}:
     *   delete:
     *     summary: Удалить адрес
     *     description: Удаляет отслеживаемый адрес по ID.
     *     tags: [Address]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID адреса
     *         example: 1
     *     responses:
     *       204:
     *         description: Адрес успешно удален
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
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Адрес не найден
     */
    router.delete('/address/:id', async function (req, res) {
        const {id} = req.params;
        await addressService.deleteAddress(id);
        res.status(204).end();
    });

    return router
}

export default addressRouter