import { Journey } from './journey.interface';

export interface Booking {
  id: number;
  journey: Journey;
  passenger_name: string;
  passenger_email: string;
  seats: number;
  total_price: number;
  created_at: string;
}