const util = require('util');

module.exports = {
    fields: {
        g_exchange_name: { type: 'text' },
        g_stock_symbol: { type: 'text' },
        dividend_year: { type: 'int' },
        current_price: { type: 'decimal' },
        dividend: { type: 'decimal' },
        dividend_yield: { type: 'decimal' },
        price_date: { type: 'date' }
    },
    key: [
        ["g_exchange_name"], 'g_stock_symbol', 'dividend_year'
    ],
    table_name: "dividend_summary"
};