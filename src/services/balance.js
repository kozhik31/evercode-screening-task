import AddressRepository from "../repositories/address.repository.js";
import {RequestError} from "../errors/errors.js";

class BalanceService {
    constructor(db) {
        this.url = "https://mempool.space/api/address/"
        this.db = db
        this.addressRepository = new AddressRepository(db)
    }

    async fetchBalance(name) {
        const url = this.url + name
        const response = await fetch(url);

        if (!response.ok) {
            throw new RequestError(`Ошибка запроса: ${url}`, response.statusCode);
        }

        const data = await response.json();
        return (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100_000_000
    }

    async updateBalances() {
        const addresses = await this.addressRepository.getAll()

        for (const address of addresses) {
            const balance = await this.fetchBalance(address.name)
            if (parseFloat(balance) !== address.balance) {
                await this.addressRepository.updateBalance(address.id, balance)
            }
        }
    }
}

export default BalanceService