import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MyInvestorService {
  constructor(public http: Http) { }

  /**
   * Get list of stock exchanges.
   */
  public getExchanges() {
    return this.httpJson(API_URL + '/exchanges');
  }

  public getExchangeSummaries() {
    return this.httpJson(API_URL + '/exchanges/summary');
  }

  public getExchangeStocks(exchangeName: string) {
    return this.httpJson(API_URL + '/stocks/' + exchangeName);
  }

  public getStockHistories(exchangeName: string, stockSymbol) {
    return this.httpJson(API_URL + '/history/' + exchangeName + "/" + stockSymbol);
  }


  private httpJson(url: string) {
    return this.http.get(url)
      .map((res) => res.json())
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }
}
