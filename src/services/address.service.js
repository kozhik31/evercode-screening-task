import CurrencyRepository from "../repositories/currency.repository.js";

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

    async addAddress(id) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const address = await this.addressRepository.insert(id);
            await this.db.exec('COMMIT');
            return address;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error
        }
    }

    async updateAddress(id) {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const address = await this.addressRepository.update(id);
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

}

export default AddressService