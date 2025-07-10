const { getCoinPriceOnDate } = require('../services/coingecko');
const db = require('../config/db');
const { delay } = require('../utils/helpers');


class FetchController {
  static async savePrices(prices) {
    const stmt = db.prepare('INSERT OR REPLACE INTO prices (date, price) VALUES (?, ?)');
    
    for (const { date, price } of prices) {
      await new Promise((resolve, reject) => {
        stmt.run(date, price, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    
    stmt.finalize();
  }

  static async fetchHistoricalPrices(startDate, endDate, coinId = 'bitcoin', requestsPerMinute = 10) {
    const prices = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    const interval = 60000 / requestsPerMinute;

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];

      try {
        const price = await getCoinPriceOnDate(coinId, dateString);
        prices.push({ date: dateString, price });
        console.log(`[${new Date().toISOString()}] Fetched ${coinId} price for ${dateString}: ${price} USD`);
      } catch (error) {
        console.error(`[ERROR] Failed to fetch ${coinId} price for ${dateString}:`, error.message);
      }

      await delay(interval);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return prices;
  }
}

module.exports = FetchController;
