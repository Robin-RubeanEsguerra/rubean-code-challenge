import { Component, OnInit, signal } from '@angular/core';
import { DataService } from '../../service/data.service';
import { CustomerInput, CustomerResponse } from '../../models/customer';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Spinner } from '../spinner/spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [FormsModule, ReactiveFormsModule, Spinner],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table implements OnInit {
  customers = signal<CustomerResponse[]>([]);
  customer: CustomerInput = {
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
  };
  editingId: number | null = null;
  searchQuery = '';
  isLoading = signal(false);
  isSubmitting = signal(false);
  deletingId = signal<number | null>(null);

  customerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    contact: new FormControl(''),
  });

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {}

  allowContactChars(event: Event) {
    const input = event.target as HTMLInputElement;
    const filtered = input.value.replace(/[^0-9+]/g, '');
    if (input.value !== filtered) {
      this.customerForm.controls.contact.setValue(filtered);
    }
  }

  ngOnInit() {
    this.getCustomersData();
  }

  getCustomersData() {
    this.isLoading.set(true);

    this.dataService.getCustomers(this.searchQuery).subscribe({
      next: (response) => {
        this.customers.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch customers:', error);
        this.isLoading.set(false);
      },
    });
  }

  // Create/ Update customer
  insertData(id: number | null) {
    this.isSubmitting.set(true);
    const customer: CustomerInput = {
      first_name: this.customerForm.value.firstName ?? '',
      last_name: this.customerForm.value.lastName ?? '',
      email: this.customerForm.value.email ?? '',
      contact: this.customerForm.value.contact ?? '',
    };

    // Update
    if (id) {
      const updatedCustomer: CustomerResponse = {
        ...customer,
        id: id,
        created_at: new Date(),
        updated_at: new Date(),
      };
      this.dataService.updateCustomer(updatedCustomer).subscribe({
        next: (response) => {
          this.getCustomersData();
          this.customerForm.reset();
          this.editingId = null;
          this.isSubmitting.set(false);
          alert('Customer updated successfully');
        },
        error: (error) => {
          this.isSubmitting.set(false);

          this.showError(error, 'Failed to update customer');
        },
      });
    } else {
      // Create
      this.dataService.addCustomer(customer).subscribe({
        next: (response) => {
          this.getCustomersData();
          this.customerForm.reset();
          this.editingId = null;
          this.isSubmitting.set(false);
          alert('Customer created successfully');
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.showError(error, 'Failed to create customer');
        },
      });
    }
  }

  deleteCustomerData(id: number) {
    this.deletingId.set(id);
    this.dataService.deleteCustomer(id).subscribe({
      next: (response) => {
        this.getCustomersData();
        this.deletingId.set(null);
        alert('Customer deleted successfully');
      },
      error: (error) => {
        this.deletingId.set(null);
        this.showError(error, 'Failed to delete customer');
      },
    });
  }

  updateCustomerButton(customer: CustomerResponse) {
    this.editingId = customer.id;
    this.customerForm.patchValue({
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      contact: customer.contact,
    });
  }

  clearFields() {
    this.customerForm.reset();
    this.editingId = null;
  }

  viewCustomer(id: number) {
    this.router.navigate(['/customers', id]);
  }

  showError(error: any, backupMessage: string) {
    console.error('Merge', error);

    if (error.status === 422) {
      const messages = Object.values(error.error.errors).flat().join('\n');
      return alert(messages);
    }

    // generic error handling
    alert(backupMessage);
  }
}
