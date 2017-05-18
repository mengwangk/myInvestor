import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { XLargeDirective } from './x-large';
import { Observable } from 'rxjs/Observable';
import { MyInvestorService } from '../services/myinvestor.service';
import * as hot from 'handsontable';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'analysis',  
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    MyInvestorService
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./portfolio.component.css'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent implements OnInit {

  constructor(
    public appState: AppState,
    public myInvestor: MyInvestorService
  ) { }

  public ngOnInit() {
  }
}

