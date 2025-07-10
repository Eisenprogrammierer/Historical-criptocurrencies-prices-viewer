const { scheduleJob } = require('node-schedule');
const CoingeckoService = require('./coingecko-service');
const db = require('../config/db');


class DataCollector {
  constructor() {
    this.coingecko = new CoingeckoService();
  }

  async fetchAndStore(coinId) {
    try {
      const price = await this.coingecko.getCurrentPrice(coinId);
      await db.query(
        'INSERT INTO prices(coin_id, price) VALUES(?, ?)',
        [coinId, price]
      );
      console.log(`[${new Date()}] Stored ${coinId} price: ${price}`);
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  }

  startScheduler(coinId = 'bitcoin') {
    scheduleJob('*/10 * * * *', () => this.fetchAndStore(coinId));
  }
}

module.exports = DataCollector;
