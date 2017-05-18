import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import { MyInvestorService, LoggerService } from "../core/service";
import { FundamentalService } from "./fundamental";
import { Stock, DividendSummary } from "../shared/model";
import { Criteria } from "./criteria.enum";
import { DividendDetailsComponent } from "./dividend-details";

import { MdSnackBar, MdSnackBarConfig, MdSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  private exchangeName: string;
  private yearOption: Criteria;
  private dividendSummaries: DividendSummary[];
  private dividendAchievers: Stock[];
  private stocks: Stock[];
  private statusMessage: string;
  private showProgress: boolean;
  private progressValue: number;
  private progressBufferValue: number;
  private dividendYield: number;
  private numberOfYears: number;
  private scopeOfYears: number;
  private showResults: boolean;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public myInvestor: MyInvestorService,
    public logger: LoggerService,
    public fundamentalService: FundamentalService,
    public snackBar: MdSnackBar
  ) {

  }

  ngOnInit() {
    this.dividendYield = environment.fundamental.dividendYield;
    this.numberOfYears = environment.fundamental.numberOfYears;
    this.scopeOfYears = environment.fundamental.scopeOfYears;
    this.dividendAchievers = [];
    this.exchangeName = this.route.snapshot.params['exchangeName'];
    if (!this.exchangeName) {
      this.exchangeName = environment.defaultExchange;
    }
    this.statusMessage = "Running...";
    this.showProgress = false;
    this.showResults = false;
    this.yearOption = environment.fundamental.yearOption;
    this.getStocks();
    this.getDividendSummary();
  }

  private runAnalysis() {
    this.showProgress = true;
    this.progressValue = 0;
    this.progressBufferValue = this.stocks.length;
    this.dividendAchievers = [];
    for (let stock of this.stocks) {
      this.statusMessage = stock.stockName;
      this.progressValue += 1;
      var stockDividends = this.dividendSummaries.filter(dividend => dividend.stockSymbol === stock.stockSymbol);
      stockDividends.sort(orderDividendDateDesc); // Sort by dividend year descending

      if (this.fundamentalService.isDividendAchiever(stock, stockDividends, this.dividendYield, this.numberOfYears, this.scopeOfYears, this.yearOption)) {
        this.dividendAchievers.push(stock);
      }
    }
    this.showProgress = false;
    this.showResults = true;
  }

  private showDividendDetails(stockSymbol: string) {
    var stockDividends = this.dividendSummaries.filter(dividend => dividend.stockSymbol === stockSymbol);
    stockDividends.sort(orderDividendDateDesc);
    let config:MdSnackBarConfig = new MdSnackBarConfig();
    config.duration = 5000; // Show for 5 seconds
    let component:MdSnackBarRef<DividendDetailsComponent> = this.snackBar.openFromComponent(DividendDetailsComponent, config);
    component.instance.showDetails(stockDividends);
  }

  private getStocks() {
    this.myInvestor.getExchangeStocks(this.exchangeName).subscribe(
      (stocks) => {
        if (stocks.length > 0) {
          this.stocks = [];
          for (let stock of stocks) {
            var dividendHistories: DividendSummary[] = [];
            this.stocks.push(
              new Stock(
                stock.exchange_name,
                stock.stock_symbol,
                stock.stock_name,
                dividendHistories
              )
            );
          }
        } else {
          this.router.navigate(['/notfound']);
        }
      },
      (error) => {
        this.logger.error('Error retrieving stocks', error);
        return Observable.throw(error);
      }
    );
  }

  private getDividendSummary() {
    this.myInvestor.getDividendSummary(this.exchangeName).subscribe(
      (summaries) => {
        if (summaries.length > 0) {
          this.dividendSummaries = [];
          for (let summary of summaries) {
            this.dividendSummaries.push(
              {
                exchangeName: summary.g_exchange_name,
                stockSymbol: summary.g_stock_symbol,
                dividendYear: summary.dividend_year,
                currentPrice: summary.current_price,
                dividend: summary.dividend,
                dividendYield: summary.dividend_yield,
                priceDate: summary.price_date
              }
            );
          }
        } else {
          this.router.navigate(['/notfound']);
        }
      },
      (error) => {
        this.logger.error('Error retrieving dividend summaries', error);
        return Observable.throw(error);
      }
    );
  }
}

function orderDividendDateDesc(dividendSummary1: DividendSummary, dividendSummary2: DividendSummary) {
  if (dividendSummary1.dividendYear > dividendSummary2.dividendYear) {
    return -1;
  }
  if (dividendSummary1.dividendYear < dividendSummary2.dividendYear) {
    return 1;
  }
  return 0;
}


