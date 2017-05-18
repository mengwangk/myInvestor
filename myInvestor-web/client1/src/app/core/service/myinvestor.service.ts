import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MyInvestorService {
  
  private serverUrl: string;

  constructor(public http: Http) {
      this.serverUrl = environment.API_URL;
   }

  /**
   * Get list of stock exchanges.
   */
  public getExchanges() {
    return this.httpJson(this.serverUrl  + '/exchanges');
  }

  public getExchangeStocks(exchangeName: string) {
    return this.httpJson(this.serverUrl  + '/stocks/' + exchangeName);
  }

  public getStockHistories(exchangeName: string, stockSymbol) {
    return this.httpJson(this.serverUrl  + '/history/' + exchangeName + "/" + stockSymbol);
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
