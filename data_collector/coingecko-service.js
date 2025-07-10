const axios = require('axios');

const API_KEY = process.env.COINGECKO_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

async function fetchBitcoinData() {
  try {
    const response = await axios.get(`${BASE_URL}/simple/price`, {
      params: {
        ids: 'bitcoin',
        vs_currencies: 'usd',
        precision: 2
      },
      headers: {
        'x-cg-api-key': API_KEY
      }
    });

    return {
      price: response.data.bitcoin.usd,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`CoinGecko API error: ${error.response?.data?.error || error.message}`);
  }
}

module.exports = { fetchBitcoinData };
