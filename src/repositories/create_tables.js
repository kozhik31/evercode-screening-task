async function createTables(db) {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS currency (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL
    )
  `);
}

export default createTables