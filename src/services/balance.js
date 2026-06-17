import AddressRepository from "../repositories/address.repository.js";
import {RequestError} from "../errors/errors.js";
import {createHttpClient} from "../utils/axios.js";

class BalanceService {
    constructor(db) {
        this.url = "https://mempool.space/api/address/"
        this.db = db
        this.addressRepository = new AddressRepository(db)

        this.client = createHttpClient({ timeout: 5000 })
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchBalance(name) {
        const url = this.url + name;

        try {
            const response = await this.client.get(url);
            const data = response.data;

            return (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100_000_000;
        } catch (error) {
            const status = error.response?.status || 500;
            throw new RequestError(`Ошибка запроса: ${url}. ${error.message}`, status);
        }
    }

    async updateBalances() {
        const addresses = await this.addressRepository.getAll()

        for (const address of addresses) {
            const balance = await this.fetchBalance(address.name)
            if (parseFloat(balance) !== address.balance) {
                await this.addressRepository.updateBalance(address.id, balance)
            }
            await this.#delay(250);
        }
    }
}

export default BalanceService