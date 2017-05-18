import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { GridOptions } from "ag-grid/main";
import { AgGridModule } from "ag-grid-angular/main";
import { DateComponent } from "../shared/date-component";
import { HeaderComponent } from "../shared/header-component";
import { HeaderGroupComponent } from "../shared/header-group-component";
import { MyInvestorService } from "../core/service";

@Component({
  selector: 'app-dashboard',
  providers: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  public exchangeName: string;
  private exchangeSummaries: ExchangeSummary[];
  private routeSubscriber: any;
  private showingStocks: boolean;
  private exchangeCount: number;

  private gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  private columnDefs: any[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;

  /*
    Constructor.
  */
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public myInvestor: MyInvestorService
  ) { }


  public ngOnInit() {
    this.exchangeCount = 1;
    this.getExchanges();
    this.routeSubscriber = this.route.params.subscribe(params => {
      this.exchangeName = params['exchangeName'];
      if (this.exchangeName) {
        this.getStocks(this.exchangeName);
      }
    });
  }

  public ngOnDestroy() {
    this.routeSubscriber.unsubscribe();
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Listed stocks for ' + this.exchangeName,
        headerGroupComponentFramework: HeaderGroupComponent,
        children: [
          {
            headerName: "Symbol", width: 100, field: "stock_symbol", 
            cellRenderer: symbolRenderer, filter: 'text', cellRendererParams: { exchange_name: this.exchangeName }
          },
          { headerName: "Name", field: "stock_name", width: 300, filter: 'text' },
        ]
      }
    ];

  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
      var model = this.gridOptions.api.getModel();
      var totalRows = this.rowData.length;
      var processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  private onModelUpdated() {
    // onModelUpdated');
    this.calculateRowCount();
  }

  private onReady() {
    //console.log('onReady');
    this.calculateRowCount();
  }

  private onCellClicked($event) {
    console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellValueChanged($event) {
    console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  private onCellDoubleClicked($event) {
    console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellContextMenu($event) {
    console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellFocused($event) {
    console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }

  private onRowSelected($event) {
    // taking out, as when we 'select all', it prints to much to the console!!
    // console.log('onRowSelected: ' + $event.node.data.name);
  }

  private onSelectionChanged() {
    console.log('selectionChanged');
  }

  private onBeforeFilterChanged() {
    console.log('beforeFilterChanged');
  }

  private onAfterFilterChanged() {
    console.log('afterFilterChanged');
  }

  private onFilterModified() {
    console.log('onFilterModified');
  }

  private onBeforeSortChanged() {
    console.log('onBeforeSortChanged');
  }

  private onAfterSortChanged() {
    console.log('onAfterSortChanged');
  }

  private onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  private onRowClicked($event) {
    console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  private onColumnEvent($event) {
    //console.log('onColumnEvent: ' + $event);
  }

  /* Get all the available exchanges */
  private getExchanges() {
    this.myInvestor.getExchanges().subscribe(
      (summaries) => {
        this.exchangeSummaries = [];
        for (let summary of summaries) {
          this.exchangeSummaries.push({ name: summary.exchange_name, count: summary.stock_count });
        }
        this.exchangeCount = this.exchangeSummaries.length;
      },
      (error) => {
        console.error('Error retrieving exchanges');
        this.router.navigate(['/notfound']);
        return Observable.throw(error);
      }
    );
  }

  private getStocks(exchangeName: string) {
    this.showingStocks = true;
    this.exchangeName = exchangeName;
    this.rowData = [];
    this.initGrid();
    this.myInvestor.getExchangeStocks(this.exchangeName).subscribe(
      (stocks) => {
        if (stocks.length > 0) {
          this.rowData = stocks;
          this.showingStocks = false;
          this.showGrid = true;
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

  public hideStocks() {
    this.showGrid = false;
  }

  private initGrid() {
    if (this.gridOptions) return;
    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{};
    this.createColumnDefs();
    this.showGrid = true;
    this.gridOptions.dateComponentFramework = DateComponent;
    this.gridOptions.defaultColDef = {
      headerComponentFramework: <{ new (): HeaderComponent }>HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    }
  }
}

interface ExchangeSummary {
  name: string;
  count: number;
}

function symbolRenderer(params) {
  return '<a href="#/info/' + params.exchange_name + '/' + params.value + '">' + params.value + '</a>';
}


