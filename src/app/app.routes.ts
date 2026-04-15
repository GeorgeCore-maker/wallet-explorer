// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent) },
  { path: 'wallet/:address', loadComponent: () => import('./features/wallet/wallet.component').then(m => m.WalletComponent) },
  { path: '**', redirectTo: '' }
];
