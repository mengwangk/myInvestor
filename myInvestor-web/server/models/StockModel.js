const util = require('util');

module.exports = {
    fields: {
        exchange_name: { type: 'text' },
        stock_symbol: { type: 'text' },
        stock_name: { type: 'text' }
    },
    key: [
        ['exchange_name'], 'stock_symbol'
    ],
    table_name: "stock"
};