const https = require('https');
const { promisify } = require('util');

class CoingeckoService {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
    this.requestCount = 0;
    this.MAX_REQUESTS_PER_MINUTE = 10;
  }

  async fetchMarketRange(coinId, startDate, endDate) {
    if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      await this.wait(61000);
      this.requestCount = 0;
    }

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);
    
    const url = `${this.baseUrl}/coins/${coinId}/market_chart/range` +
               `?vs_currency=usd&from=${startTimestamp}&to=${endTimestamp}`;

    this.requestCount++;
    return this.makeRequest(url);
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}`));
          }
        });
      }).on('error', reject);
    });
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new CoingeckoService();
