import { Component, OnInit } from '@angular/core';
import { DividendSummary } from "../../shared/model";

@Component({
  selector: 'app-dividend-details',
  templateUrl: './dividend-details.component.html',
  styleUrls: ['./dividend-details.component.css']
})
export class DividendDetailsComponent implements OnInit {

  dividendSummaries: DividendSummary[];
  stockSymbol: string;
  currentPrice: number;
  priceDate: Date;

  constructor() {

  }

  ngOnInit() {
  }

  public showDetails(dividendSummaries: DividendSummary[]) {
    this.dividendSummaries = dividendSummaries;
    this.stockSymbol = this.dividendSummaries[0].stockSymbol;
    this.currentPrice = this.dividendSummaries[0].currentPrice;
    this.priceDate = this.dividendSummaries[0].priceDate;
  }

}
