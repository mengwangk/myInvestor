export class DividendSummary {
    
    constructor(
        public exchangeName: string,
        public stockSymbol: string,
        public dividendYear: number,
        public currentPrice: number,
        public dividend: number,   
        public dividendYield: number,
        public priceDate: Date
    )
    {

    }

}