import express from 'express';
import CurrencyService from '../services/currency.js'

const router = express.Router();
const currencyService = new CurrencyService()



router.get('/currency/:name', function (req, res) {
    try {
        const {name} = req.params;
        const currency = currencyService.getCurrencyByName(name);
        res.status(200).json(currency);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

router.delete('/currency/:name', function (req, res) {
    const {name} = req.params;
    currencyService.deleteCurrency(name);
    res.status(204).end();
});

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