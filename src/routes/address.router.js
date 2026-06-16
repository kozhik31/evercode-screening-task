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
     * @swagger
     * /address/{id}:
     *   get:
     *     summary: Получить адрес по ID
     *     description: Возвращает информацию об отслеживаемом адресе по его идентификатору.
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
     *               $ref: '#/components/schemas/Address'
     *       400:
     *         description: Некорректный запрос
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/address/:id', async function (req, res) {
        const {id} = req.params;
        const address = await addressService.getAddressById(id);
        res.status(200).json(address);
    });


    /**
     * @swagger
     * /address/{id}/blockchain-height:
     *   get:
     *     summary: Получить текущую высоту блокчейна
     *     description: Получает адрес по ID, определяет его блокчейн и возвращает текущую высоту этого блокчейна.
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
     *               $ref: '#/components/schemas/BlockchainHeight'
     *       400:
     *         description: Некорректный запрос
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/address/:id/blockchain-height', async function (req, res) {
        const {id} = req.params;
        const address = await addressService.getAddressById(id);
        const height = await addressService.getBlockHeight(address.blockchain);
        const result = {blockchain: address.blockchain, height: height}
        res.status(200).json(result);
    });


    /**
     * @swagger
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
     *             $ref: '#/components/schemas/AddressCreateRequest'
     *     responses:
     *       201:
     *         description: Адрес успешно создан
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Address'
     *       400:
     *         description: Не переданы обязательные поля или блокчейн не поддерживается
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Связанный ресурс не найден
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
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
     *             $ref: '#/components/schemas/AddressUpdateRequest'
     *     responses:
     *       200:
     *         description: Адрес успешно обновлен
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Address'
     *       400:
     *         description: Не переданы обязательные поля или блокчейн не поддерживается
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /address/{id}:
     *   delete:
     *     summary: Удалить адрес
     *     description: Удаляет отслеживаемый адрес по его идентификатору.
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
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Пользователь не авторизован
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       403:
     *         description: Доступ запрещен
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Адрес не найден
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.delete('/address/:id', async function (req, res) {
        const {id} = req.params;
        await addressService.deleteAddress(id);
        res.status(204).end();
    });

    return router
}

export default addressRouter