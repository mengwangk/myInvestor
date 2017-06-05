import { NgModule, ApplicationRef } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { CustomToastOptions } from './custom-toast-options';
import { ToastOptions } from 'ng2-toastr';
import { AccordionModule } from 'ngx-bootstrap';

import { FundamentalService } from './stock-picker/fundamental';

import 'hammerjs';

import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

import { ROUTES } from './app.routes';

import { SharedModule } from './shared';
import { CoreModule } from './core';

import { AppComponent } from './app.component';
import { StockPickerComponent } from './stock-picker';
import { PortfolioComponent } from './portfolio';
import { NoContentComponent } from './no-content';
import { DividendDetailsComponent } from './stock-picker/dividend-details';
import { AnalysisComponent } from './analysis';
import { PickedStocksPipe } from './analysis/pipe';
import { PickedStocksDetailsComponent } from './analysis/picked-stocks-details';
import { TechAnalysisComponent } from './tech-analysis/tech-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    StockPickerComponent,
    PortfolioComponent,
    NoContentComponent,
    DividendDetailsComponent,
    AnalysisComponent,
    PickedStocksPipe,
    PickedStocksDetailsComponent,
    TechAnalysisComponent
  ],
  providers: [
    { provide: ToastOptions, useClass: CustomToastOptions },
    FundamentalService
  ],
  entryComponents: [
    DividendDetailsComponent,
    PickedStocksDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    ToastModule.forRoot(),
    AccordionModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }