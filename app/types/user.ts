export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  phone: string;
  tax_id?: string;
  address?: string;
  sector: string;
  created_at: string;
  updated_at: string;
  role?: 'admin' | 'user';
}