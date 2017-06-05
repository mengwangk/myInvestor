import {
  Component,
  OnInit,
  Input,
  ViewContainerRef
} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { MyInvestorService, LoggerService } from "../core/service";
import { FundamentalService } from "./fundamental";
import { Stock, DividendSummary } from "../shared/model";
import { Criteria } from "./criteria.enum";
import { DividendDetailsComponent } from "./dividend-details";

import { MdSnackBar, MdSnackBarConfig, MdSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-stock-picker',
  templateUrl: './stock-picker.component.html',
  styleUrls: ['./stock-picker.component.css']
})
export class StockPickerComponent implements OnInit {
  private exchangeName: string;
  private yearOption: Criteria;
  private dividendSummaries: DividendSummary[];
  private filteredStocks: Stock[];
  private allStocks: Stock[];
  private statusMessage: string;
  private showProgress: boolean;
  private progressValue: number;
  private progressBufferValue: number;
  private dividendYield: number;
  private numberOfYears: number;
  private scopeOfYears: number;
  private showResults: boolean;

  private categoryName: string;

  constructor(
    public toastr: ToastsManager, 
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
    public router: Router,
    public myInvestor: MyInvestorService,
    public logger: LoggerService,
    public fundamentalService: FundamentalService,
    public snackBar: MdSnackBar
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.dividendYield = environment.fundamental.dividendYield;
    this.numberOfYears = environment.fundamental.numberOfYears;
    this.scopeOfYears = environment.fundamental.scopeOfYears;
    this.filteredStocks = [];
    this.exchangeName = this.route.snapshot.params['exchangeName'];
    if (!this.exchangeName) {
      this.exchangeName = environment.defaultExchange;
    }
    this.statusMessage = "Running...";
    this.showProgress = false;
    this.showResults = false;
    this.yearOption = environment.fundamental.yearOption;
    this.categoryName = 'My Stocks';
    this.getStocks();
    this.getDividendSummary();
  }

  private runPicker() {
    try {
      this.showProgress = true;
      this.progressValue = 0;
      this.progressBufferValue = this.allStocks.length;
      this.filteredStocks = [];
      for (let stock of this.allStocks) {
        this.statusMessage = stock.stockName;
        this.progressValue += 1;
        var stockDividends = this.dividendSummaries.filter(dividend => dividend.stockSymbol === stock.stockSymbol);
        stockDividends.sort(orderDividendDateDesc); // Sort by dividend year descending

        if (this.fundamentalService.isDividendAchiever(stock, stockDividends, this.dividendYield, this.numberOfYears, this.scopeOfYears, this.yearOption)) {
          this.filteredStocks.push(stock);
        }
      }
      this.showProgress = false;
      this.showResults = true;
    } catch (error) {
      this.statusMessage = error.message;
    }
  }

  private showDividendDetails(stockSymbol: string) {
    var stockDividends = this.dividendSummaries.filter(dividend => dividend.stockSymbol === stockSymbol);
    stockDividends.sort(orderDividendDateDesc);
    let config: MdSnackBarConfig = new MdSnackBarConfig();
    config.duration = 5000; // Show for 5 seconds
    let component: MdSnackBarRef<DividendDetailsComponent> = this.snackBar.openFromComponent(DividendDetailsComponent, config);
    component.instance.showDetails(stockDividends);
  }

  private getStocks() {
    this.myInvestor.getExchangeStocks(this.exchangeName).subscribe(
      (stocks) => {
        if (stocks.length > 0) {
          this.allStocks = [];
          for (let stock of stocks) {
            var dividendHistories: DividendSummary[] = [];
            this.allStocks.push(
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

  searchByNameOrSymbol(){
    // TODO
  }
  pickStocks() {
    var chosenStocks = this.filteredStocks.filter(stock => stock.chosen);
    if (this.categoryName === '') {
      this.showWarning('Category name is empty.');
      return;
    }
    if (chosenStocks.length <= 0) {
      this.showWarning('No stocks chosen.');
      return;
    }
    var stocks = [];
    chosenStocks.forEach(stock => {
      stocks.push({exchange_name: stock.exchangeName, stock_symbol: stock.stockSymbol, category: this.categoryName});
    });
    this.myInvestor.saveChosenStocks(stocks).subscribe(
      (results) => {
        this.showInfo(results.count +  ' stocks saved!');
      },
      (error) => {
        this.logger.error('Error saving stocks', error);
        return Observable.throw(error);
      }
    );

  }

  showWarning(msg: string) {
    this.toastr.warning(msg);
  }

  showInfo(msg: string) {
    this.toastr.info(msg);
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




