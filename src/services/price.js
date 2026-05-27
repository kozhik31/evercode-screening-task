class PriceService {
    constructor() {
        this.url = "https://api.binance.com/api/v3/ticker/price?symbol="
    }

    async getPrices(ticker) {
        const url = this.url + ticker
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }

        return await response.json();
    }
}

export default PriceService