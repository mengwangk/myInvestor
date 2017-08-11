export default {
  // Functions return fixtures
  getMarkets: () => {
    return {
      ok: true,
      data: require('../Fixtures/market.json')
    }
  },  
  getStocks: (market) => {
    return {
      ok: true,
      data: require('../' + market + '/' + market + '.json')
    }
  } 
}
