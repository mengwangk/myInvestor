import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { MyInvestorService, LoggerService } from "../core/service";

import 'rxjs/add/operator/switchMap';

import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MdSnackBar, MdSnackBarConfig, MdSnackBarRef } from '@angular/material';
import { PickedStocksDetailsComponent } from './picked-stocks-details';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  pickedStocks: any;

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
      this.pickedStocks = {};
  }

  ngOnInit() {
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
        return Observable.throw(error);
      }
    );
  }

  showPickedStocks(category: string){
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

}
