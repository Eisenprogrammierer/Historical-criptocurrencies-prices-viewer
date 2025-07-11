const API_CONFIG = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  endpoints: {
    marketRange: '/coins/{id}/market_chart/range'
  },
  rateLimits: {
    requestsPerMinute: 9,
    intervalMs: 61000,
    maxRetries: 3
  }
}


const DATA_CONFIG = {
  coinId: 'bitcoin',
  dateRange: {
    start: '2015-01-01',
    end: new Date().toISOString().split('T')[0]
  },
  chunkSizeDays: 90,
  dbFilePath: './prices.db',
  progressFile: './progress.json'
}


module.exports = {
  API_CONFIG,
  DATA_CONFIG,
  
  validateConfig() {
    if (DATA_CONFIG.chunkSizeDays > 90) {
      throw new Error('Chunk size can not exceed 90 days (CoinGecko limit)')
    }
    
    if (new Date(DATA_CONFIG.dateRange.start) > new Date(DATA_CONFIG.dateRange.end)) {
      throw new Error('Start date can not be after end date')
    }
  }
}
