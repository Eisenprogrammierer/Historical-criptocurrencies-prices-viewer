const https = require('https');
const { promisify } = require('util');
const db = require('../config/db');
const { delay } = require('../utils/helpers');


const API_CONFIG = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  endpoints: {
    ping: '/ping',
    search: '/search',
    price: '/simple/price',
    history: '/coins/{id}/history'
  },
  rateLimit: {
    maxRequests: 30,
    interval: 60000
  }
};

let requestCount = 0;
const requestQueue = [];

async function makeRequest(path) {
  if (requestCount >= API_CONFIG.rateLimit.maxRequests) {
    await new Promise(resolve => requestQueue.push(resolve));
    await delay(1000);
  }

  requestCount++;
  
  return new Promise((resolve, reject) => {
    const url = `${API_CONFIG.baseUrl}${path}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function checkApiStatus() {
  try {
    await makeRequest(API_CONFIG.endpoints.ping);
    return true;
  } catch (e) {
    console.error('CoinGecko API unavailable:', e.message);
    return false;
  }
}

async function searchCoins(query) {
  const path = `${API_CONFIG.endpoints.search}?query=${encodeURIComponent(query)}`;
  const data = await makeRequest(path);
  return data.coins || [];
}


async function getCurrentPrice(coinId) {
  const path = `${API_CONFIG.endpoints.price}?ids=${coinId}&vs_currencies=usd`;
  const data = await makeRequest(path);
  return data[coinId]?.usd;
}


async function getHistoricalPrice(coinId, date) {
  const path = API_CONFIG.endpoints.history
    .replace('{id}', coinId) + `?date=${date}`;
  
  const data = await makeRequest(path);
  return data.market_data?.current_price?.usd;
}


setInterval(() => {
  requestCount = 0;
  while (requestQueue.length) requestQueue.shift()();
}, API_CONFIG.rateLimit.interval);

module.exports = {
  checkApiStatus,
  searchCoins,
  getCurrentPrice,
  getHistoricalPrice,
  _makeRequest: makeRequest
};
