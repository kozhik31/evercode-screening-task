import CurrencyRepository from "../repositories/currency.repository.js";
import {RequestError} from "../errors/errors.js";
import {createHttpClient} from "../utils/axios.js";

class PriceService {
    constructor(db) {
        this.url = "https://api.binance.com/api/v3/ticker/price?symbol="
        this.db = db
        this.currencyRepository = new CurrencyRepository(db)
        this.client = createHttpClient({ timeout: 5000 })
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchPrice(ticker) {
        const url = this.url + ticker;

        try {
            const response = await this.client.get(url);
            return response.data.price;
        } catch (error) {
            const status = error.response?.status || 500;
            throw new RequestError(`Ошибка запроса: ${url}. ${error.message}`, status);
        }
    }

    async updatePrices() {
        const currencies = await this.currencyRepository.getAll()

        for (const currency of currencies) {
            const price = await this.fetchPrice(currency.ticker)
            if (parseFloat(price) !== currency.price) {
                await this.currencyRepository.updatePrice(currency.id, price)
            }
            await this.#delay(100);
        }
    }
}

export default PriceService