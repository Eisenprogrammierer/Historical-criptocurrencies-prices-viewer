const Price = require('../models/Price.model');
const { fetchLatestPrice } = require('../services/coingecko');


const getHistory = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    if (!['day', 'week', 'month', 'year'].includes(period)) {
      return res.status(400).json({ error: 'Outdated period. Use: day, week, month, year' });
    }

    const data = await Price.getByPeriod(period);
    res.json(data);

  } catch (err) {
    console.error('[Error occured in getHistory]:', err);
    res.status(500).json({ error: 'Server error during data fetching' });
  }
};


const fetchData = async (req, res) => {
  try {
    const price = await fetchLatestPrice();
    await Price.insert(price);
    
    res.json({ 
      success: true, 
      price,
      message: 'The data have been successfully refreshed'
    });

  } catch (err) {
    console.error('[Error occured in: fetchData]:', err);
    res.status(500).json({ 
      error: 'Error occured during data refression',
      details: err.message 
    });
  }
};

module.exports = {
  getHistory,
  fetchData
};
