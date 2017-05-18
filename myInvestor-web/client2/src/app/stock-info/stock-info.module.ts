import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { CoreModule } from '../core';

import { routes } from './stock-info.route';
import { StockInfoComponent } from './stock-info.component';

import { AgGridModule } from "ag-grid-angular/main";
import { DateComponent } from "../shared/date-component";
import { HeaderComponent } from "../shared/header-component";
import { HeaderGroupComponent } from "../shared/header-group-component";


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    StockInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents(
      [
        DateComponent,
        HeaderComponent,
        HeaderGroupComponent
      ]
    )
  ],
})
export class StockInfoModule {
  public static routes = routes;
}
