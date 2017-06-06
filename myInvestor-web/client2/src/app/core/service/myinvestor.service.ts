import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { BatchJob } from '../../shared/model';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MyInvestorService {

  private serverUrl: string;

  constructor(public http: Http) {
    this.serverUrl = environment.apiUrl;
  }

  /**
   * Get list of stock exchanges.
   */
  public getExchanges() {
    return this.httpGetJson(this.serverUrl + '/exchanges');
  }

  public getExchangeStocks(exchangeName: string) {
    return this.httpGetJson(this.serverUrl + '/stocks/' + exchangeName);
  }

  public getStockHistories(exchangeName: string, stockSymbol) {
    return this.httpGetJson(this.serverUrl + '/history/' + exchangeName + "/" + stockSymbol);
  }

  public getDividendSummary(exchangeName: string) {
    return this.httpGetJson(this.serverUrl + '/analysis/dividend/' + exchangeName);
  }

  public saveChosenStocks(stocks: any) {
    return this.httpPostJson(this.serverUrl + '/stocks/chosen/', { stocks: stocks });
  }

  public getChosenStocks() {
    return this.httpGetJson(this.serverUrl + '/stocks/chosen/');
  }

  public triggerJob(job: BatchJob) {
    return this.httpPostJson(environment.jobSchedulerUrl, job);
  }

  httpGetJson(url: string) {
    return this.http.get(url)
      .map((res) => res.json())
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

  httpPostJson(url: string, data: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(data), options)
      .map((res) => res.json())
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }
}
