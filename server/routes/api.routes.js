const express = require('express');
const router = express.Router();
const FetchController = require('../controllers/fetch.controller');
const CoinUtils = require('../utils/coin-utils');


router.post('/fetch', async (req, res) => {
    try {
        const { coinName, startDate, endDate } = req.body;
        
        if (!coinName || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const coin = await CoinUtils.findCoinByName(coinName);
        if (!coin) {
            return res.status(404).json({ error: 'Coin not found' });
        }

        const prices = await FetchController.fetchHistoricalPrices(
            startDate, 
            endDate, 
            coin.id
        );
        
        res.json({
            success: true,
            coin: coin.id,
            count: prices.length,
            data: prices
        });
    } catch (error) {
        console.error('[API Error]', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

module.exports = router;
