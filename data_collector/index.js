const { fetchBitcoinData } = require('./coingecko-service');
const db = require('../server/config/db');
const { delay } = require('../server/utils/helpers');


const CONFIG = {
  interval: 10 * 60 * 1000,
  maxRequestsPerDay: 144,
  coinId: 'bitcoin'
};

class DataCollector {
  constructor() {
    this.requestCount = 0;
    this.lastReset = Date.now();
  }

  async start() {
    console.log('Starting data collector...');
    
    while (true) {
      if (this.needsReset()) {
        this.resetCounter();
      }

      if (this.requestCount < CONFIG.maxRequestsPerDay) {
        await this.collectAndStore();
        this.requestCount++;
      } else {
        console.log('⚠️ Daily request limit reached. Pausing...');
      }

      await delay(CONFIG.interval);
    }
  }

  async collectAndStore() {
    try {
      const priceData = await fetchBitcoinData();
      await this.storeInDB(priceData);
      
      console.log(`[${new Date().toISOString()}] Data stored:`, {
        price: priceData.price,
        timestamp: priceData.timestamp
      });
    } catch (error) {
      console.error('❌ Collection error:', error.message);
    }
  }

  async storeInDB(data) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO prices (timestamp, price) VALUES (?, ?)',
        [data.timestamp, data.price],
        (err) => err ? reject(err) : resolve()
      );
    });
  }

  needsReset() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    return now - this.lastReset > oneDay;
  }

  resetCounter() {
    this.requestCount = 0;
    this.lastReset = Date.now();
    console.log('♻️ Request counter reset');
  }
}


const collector = new DataCollector();
collector.start();
