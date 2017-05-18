const util = require('util');

module.exports = {
    fields: {
        exchange_name: { type: 'text' },
        stock_count: { type: 'int' },
        description: { type: 'text' }
    },
    key: ['exchange_name'],
    table_name: "exchange"
};