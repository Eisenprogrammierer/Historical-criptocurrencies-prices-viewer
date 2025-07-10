const { API_CONFIG, DATA_CONFIG } = require('./data_collector/config')
const db = require('./server/config/db')
const https = require('https')
const fs = require('fs')


class DataCollector {
  constructor() {
    this.requestCount = 0
    this.coinId = DATA_CONFIG.coinId
    this.startDate = new Date(DATA_CONFIG.dateRange.start)
    this.endDate = new Date(DATA_CONFIG.dateRange.end)
    this.currentDate = new Date(this.startDate)
  }

  async start() {
    console.log('Starting data collection...')
    this.loadProgress()

    while (this.currentDate <= this.endDate) {
      const chunkEnd = new Date(this.currentDate)
      chunkEnd.setDate(chunkEnd.getDate() + DATA_CONFIG.chunkSizeDays)

      if (chunkEnd > this.endDate) {
        chunkEnd = new Date(this.endDate)
      }

      try {
        await this.processChunk(this.currentDate, chunkEnd)
        this.saveProgress(chunkEnd)
      } catch (err) {
        console.error(`❌ Failed chunk ${this.currentDate.toISOString()} - ${chunkEnd.toISOString()}:`, err.message)
        await this.wait(30000)
      }

      this.currentDate = new Date(chunkEnd)
      this.currentDate.setDate(this.currentDate.getDate() + 1)
      
      await this.wait(API_CONFIG.rateLimits.intervalMs)
    }

    console.log('✅ Data collection complete!')
  }

  async processChunk(startDate, endDate) {
    if (this.requestCount >= API_CONFIG.rateLimits.requestsPerMinute) {
      console.log('⚠️ Rate limit reached. Waiting...')
      await this.wait(API_CONFIG.rateLimits.intervalMs)
      this.requestCount = 0
    }

    console.log(`📅 Processing ${startDate.toISOString()} to ${endDate.toISOString()}`)
    
    const data = await this.fetchData(startDate, endDate)
    await this.saveToDatabase(data)
    
    this.requestCount++
  }

  async fetchData(startDate, endDate) {
    const startTimestamp = Math.floor(startDate.getTime() / 1000)
    const endTimestamp = Math.floor(endDate.getTime() / 1000)
    
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.marketRange}`
      .replace('{id}', this.coinId)
      + `?vs_currency=usd&from=${startTimestamp}&to=${endTimestamp}`

    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = ''
        
        res.on('data', (chunk) => data += chunk)
        res.on('end', () => {
          try {
            resolve(JSON.parse(data).prices)
          } catch (err) {
            reject(new Error(`Failed to parse response: ${err.message}`))
          }
        })
      }).on('error', reject)
    })
  }

  async saveToDatabase(prices) {
    for (const [timestamp, price] of prices) {
      const date = new Date(timestamp).toISOString().split('T')[0]
      
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT OR REPLACE INTO prices (date, price) VALUES (?, ?)',
          [date, price],
          (err) => err ? reject(err) : resolve()
        )
      })
    }
  }

  loadProgress() {
    if (fs.existsSync(DATA_CONFIG.progressFile)) {
      const progress = JSON.parse(fs.readFileSync(DATA_CONFIG.progressFile))
      this.currentDate = new Date(progress.lastDate)
      console.log(`↩️ Resuming from ${progress.lastDate}`)
    }
  }

  saveProgress(lastDate) {
    fs.writeFileSync(
      DATA_CONFIG.progressFile,
      JSON.stringify({ lastDate: lastDate.toISOString() })
    )
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}


const collector = new DataCollector()
collector.start().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
