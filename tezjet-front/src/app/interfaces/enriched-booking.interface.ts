// interfaces/enriched-booking.interface.ts
import { Booking } from './booking.interface';
import { Journey } from './journey.interface'; // You'll need to create this

export interface EnrichedBooking extends Booking {
  journeyDetails?: Journey; // Optional because it's added later
}