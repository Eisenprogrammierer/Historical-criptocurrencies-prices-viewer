const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/prices.db');
const db = new sqlite3.Database(DB_PATH);


db.get("SELECT 1", (err) => {
  if (err) console.error("❌ DB connection failed:", err.message);
  else console.log("✅ DB connected");
});

module.exports = db;
