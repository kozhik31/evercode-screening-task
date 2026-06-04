import CurrencyRepository from "../repositories/currency.repository.js";

class CurrencyService {
    constructor(db) {
        this.db = db;
        this.currencyRepository = new CurrencyRepository(db)
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