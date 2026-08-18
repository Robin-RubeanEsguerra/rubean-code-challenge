import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CustomerInput, CustomerResponse } from '../models/customer';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {
  }

  getCustomers(search?: string) {
    const options = search?.trim()
      ? { params: { search: search.trim() } }
      : {};

    return this.httpClient.get<CustomerResponse[]>(
      `${environment.backendUrl}/customers`,
      options,
    );
  }

  addCustomer(customer: CustomerInput) {
    return this.httpClient.post<CustomerInput>(`${environment.backendUrl}/customers`, customer);
  }

  deleteCustomer(id: number) {
    return this.httpClient.delete<CustomerResponse>(`${environment.backendUrl}/customers/${id}`);
  }

  updateCustomer(customer: CustomerResponse) {
    return this.httpClient.put<CustomerInput>(`${environment.backendUrl}/customers/${customer.id}`, customer);
  }

  getOneCustomer(id: number) {
    return this.httpClient.get<CustomerResponse>(`${environment.backendUrl}/customers/${id}`);
  }
  
}