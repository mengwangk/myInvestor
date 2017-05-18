import { NgModule, ApplicationRef } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
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

@NgModule({
  declarations: [
    AppComponent,
    AnalysisComponent,
    PortfolioComponent,
    NoContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    CoreModule,
    SharedModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
