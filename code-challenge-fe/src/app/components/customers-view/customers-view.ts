import { Component, signal } from '@angular/core';
import { CustomerInput, CustomerResponse } from '../../models/customer';
import { DataService } from '../../service/data.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-customers-view',
  imports: [ReactiveFormsModule, Spinner],
  templateUrl: './customers-view.html',
  styleUrl: './customers-view.scss',
})
export class CustomersView {
  customer = signal<CustomerResponse | null>(null);
  isSubmitting = signal(false);
  editingId = signal<number | null>(null);

  customerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    contact: new FormControl(''),
  });
  constructor(private dataService: DataService, private route: ActivatedRoute) { }
  
  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.editingId.set(id);
    this.getOneCustomerData(id);
  }

  getOneCustomerData(id: number) {
    this.dataService.getOneCustomer(id).subscribe({
      next: (response) => {
        this.customer.set(response);
        this.customerForm.patchValue({
          firstName: response.first_name,
          lastName: response.last_name,
          email: response.email,
          contact: response.contact,
        });
      },
      error: (error) => {
        this.showError(error, 'Failed to fetch customer');
      },
    });
  }
  insertData(id: number | null) {
    this.isSubmitting.set(true);
    const customer: CustomerInput = {
      first_name: this.customerForm.value.firstName ?? '',
      last_name: this.customerForm.value.lastName ?? '',
      email: this.customerForm.value.email ?? '',
      contact: this.customerForm.value.contact ?? '',
    };

    const updatedCustomer: CustomerResponse = {
      ...customer,
      id: id ?? 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.dataService.updateCustomer(updatedCustomer).subscribe({
      next: (response) => {
        this.getOneCustomerData(id ?? 0);
        this.isSubmitting.set(false);
        alert('Customer updated successfully');
      },
      error: (error) => {
        this.isSubmitting.set(false);

        this.showError(error, 'Failed to update customer');
      },
    });


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
