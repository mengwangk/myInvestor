import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './stock-info.route';
import { StockInfoComponent } from './stock-info.component';


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    StockInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
})
export class StockInfoModule {
  public static routes = routes;
}
