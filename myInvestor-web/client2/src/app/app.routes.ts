import { Routes } from '@angular/router';
import { StockPickerComponent } from './stock-picker';
import { PortfolioComponent } from './portfolio';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: 'stock-picker/:exchangeName', component: StockPickerComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'notfound', component: NoContentComponent },
  { path: 'dashboard', loadChildren: './dashboard#DashboardModule' },
  { path: 'info', loadChildren: './stock-info#StockInfoModule' },
  { path: '', loadChildren: './dashboard#DashboardModule' },
  { path: '**', component: NoContentComponent },
];
