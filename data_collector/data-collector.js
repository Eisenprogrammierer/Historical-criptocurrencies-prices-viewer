const coingecko = require('./coingecko-service');
const db = require('./config/db');
const fs = require('fs');


class DataCollector {
  constructor() {
    this.coinId = 'bitcoin';
    this.startDate = new Date('2015-01-01');
    this.endDate = new Date();
    this.chunkSizeDays = 90;
  }

  async start() {
    console.log('Starting bulk historical data collection');
    
    let currentStart = new Date(this.startDate);
    
    while (currentStart < this.endDate) {
      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + this.chunkSizeDays);
      
      if (currentEnd > this.endDate) {
        currentEnd = new Date(this.endDate);
      }

      try {
        console.log(`📅 Fetching ${currentStart.toISOString()} to ${currentEnd.toISOString()}`);
        const result = await coingecko.fetchMarketRange(
          this.coinId,
          currentStart,
          currentEnd
        );

        await this.processData(result.prices);
        this.saveProgress(currentEnd);
        
      } catch (err) {
        console.error('❌ Chunk failed:', err.message);
        await this.wait(30000);
      }

      currentStart = new Date(currentEnd);
      currentStart.setDate(currentStart.getDate() + 1);
      
      await this.wait(7000);
    }

    console.log('✅ Historical data complete!');
  }

  async processData(prices) {
    for (const [timestamp, price] of prices) {
      const date = new Date(timestamp).toISOString().split('T')[0];
      await this.saveToDB(date, price);
    }
  }

  async saveToDB(date, price) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO prices (date, price) VALUES (?, ?)',
        [date, price],
        (err) => err ? reject(err) : resolve()
      );
    });
  }

  saveProgress(lastDate) {
    fs.writeFileSync(
      './progress.json',
      JSON.stringify({ lastDate: lastDate.toISOString() })
    );
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


const collector = new DataCollector();


if (fs.existsSync('./progress.json')) {
  const progress = JSON.parse(fs.readFileSync('./progress.json'));
  collector.startDate = new Date(progress.lastDate);
  console.log('Resuming from:', progress.lastDate);
}

collector.start();
