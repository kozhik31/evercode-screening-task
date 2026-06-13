import express from "express";
import AddressService from "../services/address.service.js";
import {BadRequestError} from "../errors/errors.js";

function addressRouter(db) {

    const router = express.Router();
    const addressService = new AddressService(db);


    router.get('/address/:id', async function (req, res) {
            const {id} = req.params;
            const address = await addressService.getAddressById(id);
            res.status(200).json(address);
    });

    router.post('/address', async function (req, res) {
        const {name, ticker} = req.body;

        if (!name || !ticker) {
            throw new BadRequestError("Поля name и ticker обязательны");
        }

        const newAddress = await addressService.addAddress(name, ticker);
        res.status(201).json(newAddress);
    });

    router.put('/address', async function (req, res) {
        const {name, ticker} = req.body;

        if (!name || !ticker) {
            throw new BadRequestError("Поля name и ticker обязательны");
        }

        const newAddress = await addressService.updateAddress(name, ticker);
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