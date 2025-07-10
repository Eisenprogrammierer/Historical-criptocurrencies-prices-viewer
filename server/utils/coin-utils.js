const { searchCoins } = require('../services/coingecko');


class CoinUtils {
  static async findCoinByName(name) {
    try {
      const coins = await searchCoins(name);
      return coins.find(coin => 
        coin.name.toLowerCase() === name.toLowerCase() || 
        coin.symbol.toLowerCase() === name.toLowerCase()
      );
    } catch (error) {
      console.error(`[CoinUtils] Error finding coin "${name}":`, error.message);
      return null;
    }
  }

  static extractCoinAttributes(coin, attributes = ['id', 'name', 'symbol']) {
    return attributes.reduce((result, attr) => {
      result[attr] = coin[attr];
      return result;
    }, {});
  }
}

module.exports = CoinUtils;
