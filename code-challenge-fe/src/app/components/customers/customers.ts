import { Component } from '@angular/core';
import { Table } from '../table/table';

@Component({
  selector: 'app-customers',
  imports: [Table,  ],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers {}
