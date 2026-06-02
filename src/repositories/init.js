import {open} from 'sqlite';
import sqlite3 from 'sqlite3';

async function initDatabase() {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
    await db.get('PRAGMA foreign_keys = ON');

    return db;
}

export default initDatabase