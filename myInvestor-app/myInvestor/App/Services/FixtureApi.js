export default {
  // Functions return fixtures
  getMarkets: () => {
    return {
      ok: true,
      data: require('../Fixtures/market.json')
    }
  }
}
