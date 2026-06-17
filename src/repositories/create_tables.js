async function createTables(db) {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS currency (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL
    )
  `);

    try {
        await db.exec(`ALTER TABLE currency ADD COLUMN price REAL`);
    } catch (error) {
        if (!error.message.includes('duplicate column name')) {
            throw error;
        }
    }


    await db.exec(`
    CREATE TABLE IF NOT EXISTS address (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      blockchain TEXT NOT NULL,
      balance REAL
    )
  `);
}

export default createTables