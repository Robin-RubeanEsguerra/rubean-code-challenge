export interface CustomerInput {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
}

export interface CustomerResponse extends CustomerInput {
  id: number;
  created_at: Date;
  updated_at: Date;
}