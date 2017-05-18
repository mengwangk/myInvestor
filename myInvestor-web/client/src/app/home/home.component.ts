import {
  Component,
  OnInit
} from '@angular/core';

import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';

import { AppState } from '../app.service';
import { XLargeDirective } from './x-large';
import { Observable } from 'rxjs/Observable';
import { MyInvestorService } from '../services/myinvestor.service';
import * as hot from 'handsontable';
import 'rxjs/add/operator/switchMap';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    MyInvestorService
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./home.component.css'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  private showStocks: boolean;
  private progressing: boolean;
  public exchangeName: string;

  // Hot table default settings
  private options: any = {
    columnSorting: true,
    contextMenu: false,
    readOnly: true,
    rowHeaders: true,
    manualColumnResize: true,
    manualRowResize: true,
    stretchH: 'all',
    autoWrapRow: true
  };

  // Stock grid settings
  private stockTableColWidths: Array<number> = [100, 600];
  private stockTableData: any = [];
  private stockTableColHeaders: Array<string> = ['Symbol', 'Name'];
  private stockTableColumns: Array<any> = [
    {
      data: 'stock_url',
      renderer: 'html'
    },
    {
      data: 'stock_name'
    }
  ];

  private exchangeSummaries: ExchangeSummary[];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appState: AppState,
    public myInvestor: MyInvestorService
  ) { }

  public ngOnInit() {
    this.progressing = false;
    this.showStocks = false;
    this.exchangeName = this.route.snapshot.params['exchangeName'];
    if (!this.exchangeName || this.exchangeName === '') {
      this.getExchanges();
    } else {
      this.getStocks(this.exchangeName);
    }
  }

  private getExchanges() {
    this.myInvestor.getExchangeSummaries().subscribe(
      (summaries) => {
        this.exchangeSummaries = [];
        for (let summary of summaries) {
          this.exchangeSummaries.push({ name: summary.exchange_name, count: summary.stock_count });
        }
      },
      (error) => {
        console.error('Error retrieving exchanges');
        this.router.navigate(['/notfound']);
        return Observable.throw(error);
      }
    );
  }

  public hideStocks() {
    this.showStocks = false;
  }

  public getStocks(exchangeName: string) {
    this.exchangeName = exchangeName;
    this.progressing = true;
    this.myInvestor.getExchangeStocks(exchangeName).subscribe(
      (stocks) => {
        if (stocks.length > 0) {
          this.showStocks = true;
          this.stockTableData = [];
          for (let stock of stocks) {
            stock.stock_url = '<a href="#/info/' + this.exchangeName + '/' + stock.stock_symbol + '">' + stock.stock_symbol + '</a>';
            this.stockTableData.push(stock);
          }
          this.progressing = false;
        } else {
          this.router.navigate(['/notfound']);
        }
      },
      (error) => {
        console.error('Error retrieving stocks');
        return Observable.throw(error);
      }
    );
  }

  public getStockHistories(stockSymbol: string) {
    console.log('Retrieving stock histories');
  }

  private afterChange(e: any) {
    console.log(e);
  }

  private afterOnCellMouseDown(e: any) {
    console.log(e);
  }
}

interface ExchangeSummary {
  name: string;
  count: number;
}

