import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ChangeDetectionStrategy
} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MdSnackBar, MdSnackBarConfig, MdSnackBarRef } from '@angular/material';
import { PickedStocksDetailsComponent } from './picked-stocks-details';
import { BatchJob } from '../shared/model';
import { MyInvestorService, LoggerService } from "../core/service";
import { BatchJobType } from "./batch-job-type.enum";

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  pickedStocks: any;

  exchanges: any;

  selectedCategory: string;
  selectedExchange: string;

  BatchJobTypeEnum = BatchJobType;

  constructor(
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
    public router: Router,
    public myInvestor: MyInvestorService,
    public logger: LoggerService,
    public snackBar: MdSnackBar
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.selectedCategory = '';
    this.pickedStocks = {};
  }

  ngOnInit() {
    this.getExchanges();
    this.getPickedStocks();
  }

  getPickedStocks() {
    this.myInvestor.getChosenStocks().subscribe(
      (stocks) => {
        stocks.forEach(stock => {
          if (!this.pickedStocks[stock.category]) {
            this.pickedStocks[stock.category] = [];
          }
          this.pickedStocks[stock.category].push(stock);
        });
      },
      (error) => {
        this.logger.error('Error retrieving picked stocks', error);
        this.showWarning('Unable to get the stocks! ' + JSON.stringify(error));
        return Observable.throw(error);
      }
    );
  }

  private getExchanges() {
    this.myInvestor.getExchanges().subscribe(
      (exchanges) => {
        this.exchanges = exchanges;
      },
      (error) => {
        this.logger.error('Error retrieving exchanges', error);
        this.showWarning('Unable to get the exchanges! ' + JSON.stringify(error));
        return Observable.throw(error);
      }
    );
  }

  showPickedStocks(category: string) {
    let config: MdSnackBarConfig = new MdSnackBarConfig();
    config.duration = 5000; // Show for 5 seconds
    let component: MdSnackBarRef<PickedStocksDetailsComponent> = this.snackBar.openFromComponent(PickedStocksDetailsComponent, config);
    component.instance.showDetails(category, this.pickedStocks[category]);

  }
  showWarning(msg: string) {
    this.toastr.warning(msg);
  }

  showInfo(msg: string) {
    this.toastr.info(msg);
  }

  runJobForPickedStocks(jobType: BatchJobType) {
    if (!this.selectedCategory || this.selectedCategory === '') {
      this.showWarning('Select a stock category to run the job.');
      return;
    }
    var jobName = BatchJobType[jobType] + "";
    var stocks = this.pickedStocks[this.selectedCategory];
    if (stocks.length > 0) {
      var exchangeName = stocks[0].exchange_name;
      var symbols = [];
      for (var i = 0; i < stocks.length; i++) {
        var stock = stocks[i];
        symbols.push(stock.stock_symbol);
      }
      this.runJob(new BatchJob(jobName, exchangeName, symbols));

    } else {
      this.showWarning('No stocks in the category.');
    }
  }

  runJobForExchange(jobType: BatchJobType) {
    if (!this.selectedExchange || this.selectedExchange === '') {
      this.showWarning('Select an exchange to run the job.');
      return;
    }
    var jobName = BatchJobType[jobType] + "";
    var symbols = [];
    this.runJob(new BatchJob(jobName, this.selectedExchange, symbols));
  }

  runJob(batchJob: BatchJob) {
    this.myInvestor.triggerJob(batchJob).subscribe(
      (results) => {
        this.showInfo("[" + batchJob.jobName + "] job is triggered.");
      },
      (error) => {
        this.logger.error('Error triggering job', error);
        this.showWarning('Error triggering job! ' + JSON.stringify(error));
        return Observable.throw(error);
      }
    );
  }
}
