CREATE KEYSPACE myInvestor
WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};

USE myInvestor;

CREATE TABLE request
(
    request_id UUID,
    success BOOLEAN,
    error_msg TEXT,
    received TIMESTAMP,
    PRIMARY KEY(request_id)
);

CREATE TABLE exchange
(
    exchange_name TEXT,
    description TEXT,
    yahoo_finance_exchange_name TEXT,
    stock_count INT,
    PRIMARY KEY(exchange_name)
);

INSERT INTO exchange(exchange_name, description, yahoo_finance_exchange_name) VALUES('KLSE', 'Kuala Lumpur Stock Exchange', 'KLS');
INSERT INTO exchange(exchange_name, description, yahoo_finance_exchange_name) VALUES('NASDAQ', 'NASDAQ', 'NMS');

CREATE TABLE stock
(
    stock_symbol TEXT,
    exchange_name TEXT,
    stock_name TEXT,
    PRIMARY KEY(exchange_name, stock_symbol)
);

CREATE TABLE stock_history
(
    stock_symbol TEXT,
    exchange_name TEXT,
    history_date DATE,
    history_open DECIMAL,
    history_high DECIMAL,
    history_low DECIMAL,
    history_close DECIMAL,
    history_volume INT,
    PRIMARY KEY(exchange_name, stock_symbol, history_date)
);

CREATE INDEX stock_history_idx1 ON stock_history (stock_symbol);

CREATE TABLE stock_info
(
    stock_symbol TEXT,
    exchange_name TEXT,
    info_52weeks_from DECIMAL,
    info_52weeks_to DECIMAL,
    info_beta DECIMAL,
    info_change DECIMAL,
    info_change_percentage TEXT,
    info_current_price DECIMAL,
    info_dividend_yield TEXT,
    info_eps DECIMAL,
    info_inst_own TEXT,
    info_market_capital TEXT,
    info_open DECIMAL,
    info_pe DECIMAl,
    info_range_from DECIMAL,
    info_range_to DECIMAL,
    info_shares TEXT,
    info_time TEXT,
    info_volume TEXT,
    info_extracted_timestamp TIMESTAMP,  
    PRIMARY KEY(exchange_name, stock_symbol)
);

CREATE TABLE g2yfinance_mapping
(
    g_stock_symbol TEXT,
    g_stock_name TEXT,
    g_exchange_name TEXT,
    y_stock_symbol TEXT,
    y_stock_name TEXT,
    y_exchange_name TEXT,
    PRIMARY KEY(g_stock_symbol, y_stock_symbol)    
);

CREATE INDEX g2yfinance_mapping_idx ON g2yfinance_mapping (y_exchange_name);

CREATE TABLE dividend_history
(
    y_stock_symbol TEXT,
    y_exchange_name TEXT,
    dividend_date DATE,
    dividend DECIMAL,
    PRIMARY KEY(y_exchange_name, y_stock_symbol, dividend_date)    
);

CREATE TABLE dividend_summary (
   g_stock_symbol TEXT,
   g_exchange_name TEXT,
   dividend_year INT,
   dividend DECIMAL,
   current_price DECIMAL,
   price_date TIMESTAMP,
   dividend_yield DECIMAL,
   PRIMARY KEY(g_exchange_name, g_stock_symbol, dividend_year)
);

CREATE TABLE ref_code
(
    code TEXT,
    description TEXT,
    ref_group TEXT,
    PRIMARY KEY(ref_group, code)    
);

INSERT INTO ref_code(code, description, ref_group) VALUES('MACD', 'Moving average convergence divergence', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('RSI', 'Relative strength index', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('BB', 'Bollinger bands', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('SMA', 'Simple moving average', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('WMA', 'Weighted moving average', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('EMA', 'Exponential moving average', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('ROC', 'Rate of change', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('CCI', 'Commodity channel index', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('EVM', 'Ease of movement', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('FI', 'Force index', 'TA_IND');
INSERT INTO ref_code(code, description, ref_group) VALUES('FIB', 'Fibonacci', 'TA_IND');


CREATE TABLE user (
    email TEXT,
    is_admin BOOLEAN,
    name TEXT,
    password TEXT,
    modified TIMESTAMP,
    PRIMARY KEY(email)
);

CREAT TABLE job ()

);

CREAT TABLE job_group (

);

CREATE TABLE portfolio (

);


