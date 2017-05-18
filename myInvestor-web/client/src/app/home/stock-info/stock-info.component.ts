import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';

import { AppState } from '../../app.service';
import { Observable } from 'rxjs/Observable';
import { MyInvestorService } from '../../services/myinvestor.service';
import * as hot from 'handsontable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'stock-info',
  providers: [
    MyInvestorService
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./stock-info.component.css'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './stock-info.component.html'
})
export class StockInfoComponent implements OnInit {

  private exchangeName: string;
  private stockSymbol: string;
  private progressing: boolean;

  // Hot table default settings
  private options: any = {
    columnSorting: true,
    contextMenu: false,
    readOnly: true,
    rowHeaders: true,
    manualColumnResize: true,
    manualRowResize: true,
    stretchH: 'all',
    autoWrapRow: true,
    className: 'htCenter htMiddle'
  };

  // Stock grid settings
  private stockInfoColWidths: Array<number> = [null, null, null, null, null, null];
  private stockInfoData: any = [];
  private stockInfoColHeaders: Array<string> = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'];
  private stockInfoColumns: Array<any> = [
    {
      data: 'history_date',
    },
    {
      data: 'history_open'
    },
    {
      data: 'history_high'
    },
    {
      data: 'history_low'
    },
    {
      data: 'history_close'
    },
    {
      data: 'history_volume'
    }
  ];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appState: AppState,
    public myInvestor: MyInvestorService
  ) { }

  public ngOnInit() {
    this.progressing = false;
    this.exchangeName = this.route.snapshot.params['exchangeName'];
    this.stockSymbol = this.route.snapshot.params['symbol'];
    this.getStockHistories();
  }

  private getStockHistories() {
    this.myInvestor.getStockHistories(this.exchangeName, this.stockSymbol).subscribe(
      (histories) => {
        this.stockInfoData = [];
        this.stockInfoData = this.stockInfoData.concat(histories);
      },
      (error) => {
        console.error('Error retrieving stock histories');
        return Observable.throw(error);
      }
    );
  }

  public onActivate(event: any) {
    console.log('activated');
  }

  public onDeactivate(event: any) {
    console.log('deactivated');
  }
}
