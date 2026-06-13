import Currency from "../entities/currency.js";
import {NotFoundError} from "../errors/errors.js";

class AddressRepository {
    constructor(db) {
        this.db = db;
    }

    async getAll() {
        const result = await this.db.all(`SELECT * FROM currency`);
        return result.map(
            row => new Currency(row.id, row.name, row.ticker, row.price)
        );
    }

    async findById(id) {
        const result = await this.db.get(`SELECT * FROM currency WHERE id = ?`, [id]);
        if (!result) throw new NotFoundError(`Валюта с id ${id} не найдена`);
        return new Currency(id, result.name, result.ticker, result.price)
    }

    async findByName(name) {
        const result = await this.db.all(`SELECT * FROM currency WHERE name = ?`, [name]);
        if (!result || result.length === 0) throw new NotFoundError(`Валюта с именем ${name} не найдена`);

        return result.map(
            row => new Currency(row.id, row.name, row.ticker, row.price)
        );
    }

    async delete(id) {
        const result = await this.db.run(`DELETE FROM currency WHERE id = ?`, [id]);
        if (result.changes === 0) throw new NotFoundError(`Валюта с id ${id} не найдена`);
        return null;
    }

    async update(id, name, ticker) {
        await this.db.run(`UPDATE currency SET name = ?, ticker = ? WHERE id = ?`, [name, ticker, id]);
        return new Currency(id, name, ticker);
    }

    async updatePrice(id, price) {
        await this.db.run(`UPDATE currency SET price = ? WHERE id = ?`, [price, id]);
    }

    async insert(name, ticker) {
        const result = await this.db.run(`INSERT INTO currency (name, ticker) VALUES (?, ?)`, [name, ticker]);
        return new Currency(result.lastID, name, ticker);
    }
}

export default CurrencyRepository