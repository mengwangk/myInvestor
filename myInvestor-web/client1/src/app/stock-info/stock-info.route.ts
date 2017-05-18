import { StockInfoComponent } from './stock-info.component';

export const routes = [
  { path: ':exchangeName/:symbol', component: StockInfoComponent,  pathMatch: 'full' },
];
