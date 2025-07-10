const db = require('../config/db');


class Price {
  static async getByPeriod(period) {
    const intervals = { day: '1 day', week: '7 days', month: '30 days' };
    const query = `
      SELECT date, price FROM prices 
      WHERE date >= datetime('now', ?) 
      ORDER BY date
    `;
    return new Promise((resolve, reject) => {
      db.all(query, [`-${intervals[period]}`], (err, rows) => {
        err ? reject(err) : resolve(rows);
      });
    });
  }

  static async insert(date, price) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO prices (date, price) VALUES (?, ?)',
        [date, price],
        (err) => err ? reject(err) : resolve()
      );
    });
  }
}

module.exports = Price;
