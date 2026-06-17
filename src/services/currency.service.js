import CurrencyRepository from "../repositories/currency.repository.js";
import {RequestError} from "../errors/errors.js";
import {createHttpClient} from "../utils/axios.js";

class CurrencyService {
    constructor(db) {
        this.db = db;
        this.currencyRepository = new CurrencyRepository(db)
        this.client = createHttpClient({timeout: 5000})
    }

    async addCurrency(name, ticker) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const currency = await this.currencyRepository.insert(name, ticker);
            await this.db.exec('COMMIT');
            return currency;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async getCurrencyByName(name) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const currency = await this.currencyRepository.findByName(name);
            await this.db.exec('COMMIT');
            return currency;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async getCurrencyById(id) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const currency = await this.currencyRepository.findById(id);
            await this.db.exec('COMMIT');
            return currency;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async getHistory(ticker, interval = "1d") {
        const url = `https://data-api.binance.vision/api/v3/klines?symbol=${ticker}&interval=${interval}`
        try {
            const response = await this.client.get(url);
            const data = await response.data;

            return data.map(row => ({
                timestamp: row[0],
                price: parseFloat(row[1])
            }));
        } catch (error) {
            const status = error.response?.status || 500;
            throw new RequestError(`Ошибка запроса: ${url}. ${error.message}`, status);
        }


    }

    async deleteCurrency(id) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const result = await this.currencyRepository.delete(id);
            await this.db.exec('COMMIT');
            return result;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async updateCurrency(id, name, ticker) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const currency = await this.currencyRepository.findById(id);

            if (currency.name === name && currency.ticker === ticker) {
                await this.db.exec('COMMIT');
                return currency;
            }

            const newCurrency = await this.currencyRepository.update(id, name, ticker);

            await this.db.exec('COMMIT');
            return newCurrency;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

}

export default CurrencyService