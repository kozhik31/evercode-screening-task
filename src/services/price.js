import CurrencyRepository from "../repositories/currency.repository.js";

class PriceService {
    constructor(db) {
        this.url = "https://api.binance.com/api/v3/ticker/price?symbol="
        this.db = db
        this.currencyRepository = new CurrencyRepository(db)
    }

    async fetchPrice(ticker) {
        const url = this.url + ticker
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }

        const data = await response.json();
        return data.price
    }

    async updatePrices() {
        const currencies = await this.currencyRepository.getAll()

        for (const currency of currencies) {
            const price = await this.fetchPrice(currency.ticker)
            if (parseFloat(price) !== currency.price) {
                await this.currencyRepository.updatePrice(currency.id, price)
            }
        }
    }
}

export default PriceService