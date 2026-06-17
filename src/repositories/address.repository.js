import {NotFoundError} from "../errors/errors.js";
import Address from "../entities/address.js";

class AddressRepository {
    constructor(db) {
        this.db = db;
    }

    async getAll() {
        const result = await this.db.all(`SELECT * FROM address`);
        return result.map(
            row => new Address(row.id, row.name, row.blockchain, row.balance)
        );
    }

    async findById(id) {
        const result = await this.db.get(`SELECT * FROM address WHERE id = ?`, [id]);
        if (!result) throw new NotFoundError(`Адрес с id ${id} не найден`);
        return new Address(id, result.name, result.blockchain, result.balance)
    }


    async delete(id) {
        const result = await this.db.run(`DELETE FROM address WHERE id = ?`, [id]);
        if (result.changes === 0) throw new NotFoundError(`Адрес с id ${id} не найден`);
        return null;
    }

    async update(id, name, blockchain) {
        await this.db.run(`UPDATE address SET name = ?, blockchain = ? WHERE id = ?`, [name, blockchain, id]);
        return new Address(id, name, blockchain);
    }

    async updateBalance(id, balance) {
        await this.db.run(`UPDATE address SET balance = ? WHERE id = ?`, [balance, id]);
    }

    async insert(name, blockchain) {
        const result = await this.db.run(`INSERT INTO address (name, blockchain) VALUES (?, ?)`, [name, blockchain]);
        return new Address(result.lastID, name, blockchain);
    }
}

export default AddressRepository