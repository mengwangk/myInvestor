import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-picked-stocks-details',
  templateUrl: './picked-stocks-details.component.html',
  styleUrls: ['./picked-stocks-details.component.css']
})
export class PickedStocksDetailsComponent implements OnInit {

  category: string;
  pickedStocks: any;

  constructor() { }

  ngOnInit() {
  }

  public showDetails(category: string, pickedStocks: any) {
    this.category = category;
    this.pickedStocks = pickedStocks;
  }


}
