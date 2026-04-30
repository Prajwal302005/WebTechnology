import { Routes } from '@angular/router';

// Define two routes: Home and Add Transaction
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Expense Tracker - Home'
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/add-transaction/add-transaction.component')
        .then(m => m.AddTransactionComponent),
    title: 'Add Transaction'
  },
  // Redirect unknown routes to home
  { path: '**', redirectTo: '' }
];
