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
}

export default createTables