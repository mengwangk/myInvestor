import { NgModule, ApplicationRef } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { CustomToastOptions } from './custom-toast-options';
import { ToastOptions } from 'ng2-toastr';

import { FundamentalService } from './analysis/fundamental';

import 'hammerjs';

import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

import { ROUTES } from './app.routes';

import { SharedModule } from './shared';
import { CoreModule } from './core';

import { AppComponent } from './app.component';
import { AnalysisComponent } from './analysis';
import { PortfolioComponent } from './portfolio';
import { NoContentComponent } from './no-content/no-content.component';
import { DividendDetailsComponent } from './analysis/dividend-details';

@NgModule({
  declarations: [
    AppComponent,
    AnalysisComponent,
    PortfolioComponent,
    NoContentComponent,
    DividendDetailsComponent
  ],
  providers: [
    { provide: ToastOptions, useClass: CustomToastOptions },
    FundamentalService
  ],
  entryComponents: [
    DividendDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    ToastModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }