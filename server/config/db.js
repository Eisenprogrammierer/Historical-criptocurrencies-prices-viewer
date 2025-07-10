const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'prices.db');
const db = new sqlite3.Database(DB_PATH);


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS prices (
      date TEXT PRIMARY KEY,
      price REAL NOT NULL
    )
  `);
});

process.on('exit', () => db.close());

module.exports = db;
