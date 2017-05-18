import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';
import { AnalysisComponent } from './analysis';
import { PortfolioComponent } from './portfolio';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: 'analysis', component: AnalysisComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'notfound', component: NoContentComponent },
  { path: '', loadChildren: './home#HomeModule' },
  { path: 'home', loadChildren: './home#HomeModule' },
  { path: '**', component: NoContentComponent },
];
