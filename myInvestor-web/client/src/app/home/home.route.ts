import { HomeComponent } from './home.component';

export const routes = [
  {
    path: '', children: [
      { path: '', component: HomeComponent },
      // { path: 'info', loadChildren: './stock-info#StockInfoModule' },
      { path: ':exchangeName', component: HomeComponent }
    ]
  },
];
