import {
  Component,
  OnInit,
  Input
} from '@angular/core';

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
  selector: 'app-stock-info',
  providers: [],
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.css']
})
export class StockInfoComponent implements OnInit {

  private exchangeName: string;
  private stockSymbol: string;

  private gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  private columnDefs: any[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public myInvestor: MyInvestorService
  ) { }

  ngOnInit() {
    this.exchangeName = this.route.snapshot.params['exchangeName'];
    this.stockSymbol = this.route.snapshot.params['symbol'];
    this.getStockHistories();
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Stock history for last ' + (this.rowData ? this.rowData.length : 0) + ' trading days',
        headerGroupComponentFramework: HeaderGroupComponent,
        children: [
          { headerName: "Date", field: 'history_date', width: 100, filter: 'text' },
          { headerName: "Open", field: "history_open", width: 100, filter: 'text' },
          { headerName: "High", field: "history_high", width: 100, filter: 'text' },
          { headerName: "Low", field: "history_low", width: 100, filter: 'text' },
          { headerName: "Close", field: "history_close", width: 100, filter: 'text' },
          { headerName: "Volume", field: "history_volume", width: 100, filter: 'text' }
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
  private getStockHistories() {
    this.initGrid();
    this.myInvestor.getStockHistories(this.exchangeName, this.stockSymbol).subscribe(
      (histories) => {
        if (histories.length > 0) {
          this.rowData = histories;
          this.createColumnDefs();
        } else {
          this.router.navigate(['/notfound']);
        }
      },
      (error) => {
        console.error('Error retrieving stock histories');
        return Observable.throw(error);
      }
    );
  }
}
