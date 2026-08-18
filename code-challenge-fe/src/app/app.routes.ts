import { Routes } from '@angular/router';
import { Table } from './components/table/table';
import { Customers } from './components/customers/customers';
import { CustomersView } from './components/customers-view/customers-view';

export const routes: Routes = [
  { path: '', component: Customers },
  { path: 'customers/:id', component: CustomersView },
];
