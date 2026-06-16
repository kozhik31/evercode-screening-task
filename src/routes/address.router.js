import express from "express";
import AddressService from "../services/address.service.js";
import {BadRequestError} from "../errors/errors.js";
import {verifyToken} from "../middleware/jwt.js";

function addressRouter(db) {

    const router = express.Router();
    const addressService = new AddressService(db);
    const supportedBlockchains = ['bitcoin']
    router.use(verifyToken)

    router.get('/address/:id', async function (req, res) {
        const {id} = req.params;
        const address = await addressService.getAddressById(id);
        res.status(200).json(address);
    });

    router.get('/address/:id/blockchain-height', async function (req, res) {
        const {id} = req.params;
        const address = await addressService.getAddressById(id);
        const height = await addressService.getBlockHeight(address.blockchain);
        const result = {blockchain: address.blockchain, height: height}
        res.status(200).json(result);
    });

    router.post('/address', async function (req, res) {
        const {name, blockchain} = req.body;

        if (!name || !blockchain) {
            throw new BadRequestError("Поля name и ticker обязательны");
        }
        if (!supportedBlockchains.includes(blockchain)) {
            throw new BadRequestError(`${blockchain} не поддерживается`);
        }


        const newAddress = await addressService.addAddress(name, blockchain);
        res.status(201).json(newAddress);
    });

    router.put('/address', async function (req, res) {
        const {id, name, blockchain} = req.body;

        if (!id || !name || !blockchain) {
            throw new BadRequestError("Поля name и ticker обязательны");
        }
        if (!supportedBlockchains.includes(blockchain)) {
            throw new BadRequestError(`${blockchain} не поддерживается`);
        }

        const newAddress = await addressService.updateAddress(id, name, blockchain);
        res.status(200).json(newAddress);
    });

    router.delete('/address/:id', async function (req, res) {
        const {id} = req.params;
        await addressService.deleteAddress(id);
        res.status(204).end();
    });

    return router
}

export default addressRouter