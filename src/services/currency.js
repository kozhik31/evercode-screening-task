import Currency from '../entities/currency.js'

class CurrencyService {
    constructor() {
        this.currencies = new Map();
    }

    async addCurrency(name, ticker) {
        if (this.currencies.has(name))
            throw new Error(`Валюта с именем ${name} уже существует`);

        const currency = new Currency(name, ticker);
        this.currencies.set(name, currency);
        return currency;
    }

    async getCurrencyByName(name) {
        if (this.currencies.has(name))
            return this.currencies.get(name);
        else
            throw new Error(`Валюты с именем ${name} не существует`);
    }

    async deleteCurrency(name) {
        this.currencies.delete(name);
    }

    async updateCurrency(name, ticker) {
        if (this.currencies.has(name)) {
            const currency = new Currency(name, ticker);
            this.currencies.set(name, currency);
            return currency;
        } else
            throw new Error(`Валюты с именем ${name} не существует`);
    }

}

export default CurrencyService