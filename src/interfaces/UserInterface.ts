export interface UserInterface {
  id: number;
  email: string;
  name: string;
  phone_number: string|null;
  address: string|null;
  city: string|null;
  postal_code: string|null;
  country: string|null;
  verified_date: string|null;
  user_roles: string[];
}
