import { DividendSummary } from "./dividendsummary";

export class Stock {

     constructor(
        public exchangeName: string,
        public stockSymbol: string,
        public stockName: string,
        public dividendHistories: DividendSummary[],
        public chosen: boolean = false
    )
    {
    }

    dividendYieldPrice() {
        if (this.dividendHistories.length >0) {
            return this.dividendHistories[0].currentPrice;
        }
        return 0;
    }
    
}
