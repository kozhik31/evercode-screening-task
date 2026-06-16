import AddressRepository from "../repositories/address.repository.js";
import {RequestError} from "../errors/errors.js";

class AddressService {
    constructor(db) {
        this.db = db;
        this.addressRepository = new AddressRepository(db)
    }

    async getAddressById(id) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const address = await this.addressRepository.findById(id);
            await this.db.exec('COMMIT');
            return address;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async addAddress(name, blockchain) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const address = await this.addressRepository.insert(name, blockchain);
            await this.db.exec('COMMIT');
            return address;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async updateAddress(id, name, blockchain) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const address = await this.addressRepository.update(id, name, blockchain);
            await this.db.exec('COMMIT');
            return address;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async deleteAddress(id) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const result = await this.addressRepository.delete(id);
            await this.db.exec('COMMIT');
            return result;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async getBlockHeight(blockchain) {
        if (blockchain === 'bitcoin') {
            const url = "https://blockstream.info/api/blocks/tip/height"
            const response = await fetch(url)
            if (!response.ok) throw new RequestError(`Ошибка запроса: ${url}`, response.statusCode);

            return await response.json()
        }
    }

}

export default AddressService