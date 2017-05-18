const util = require('util');

module.exports = {
    fields: {
        exchange_name: { type: 'text' },
        stock_symbol: { type: 'text' },
        history_date: { type: 'date' },
        history_close: { type: 'decimal' },
        history_high: { type: 'decimal' },
        history_low: { type: 'decimal' },
        history_open: { type: 'decimal' },
        history_volume: { type: 'int' }
    },
    key: [
        ['exchange_name'], 'stock_symbol', 'history_date'
    ],
    indexes: ["stock_symbol"],
    table_name: "stock_history"
};