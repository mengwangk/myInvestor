import { Routes } from '@angular/router';
import { AnalysisComponent } from './analysis';
import { PortfolioComponent } from './portfolio';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: 'analysis/:exchangeName', component: AnalysisComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'notfound', component: NoContentComponent },
  { path: 'dashboard', loadChildren: './dashboard#DashboardModule' },
  { path: 'info', loadChildren: './stock-info#StockInfoModule' },
  { path: '', loadChildren: './dashboard#DashboardModule' },
  { path: '**', component: NoContentComponent },
];
