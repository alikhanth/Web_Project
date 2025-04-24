import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../interfaces/booking.interface';  
import { Journey } from '../interfaces/journey.interface';
import { map,switchMap} from 'rxjs/operators'; 
import { forkJoin } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: {
    journey: number;          // Just the ID
    passenger_name: string;
    passenger_email: string;
    seats: number;
  }): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings/`, bookingData);
  }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/`);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`).pipe(
      switchMap(bookings =>
        forkJoin(
          bookings.map(booking =>
            this.http.get<Journey>(`${this.apiUrl}/journeys/${booking.journey}`).pipe(
              map(journey => ({
                ...booking,
                journey // Replace the journey ID with the Journey object
              }))
            )
          )
        )
      )
    );
  }

  getBookingDetails(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}/`);
  } 


  cancelBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${id}/`);
  }
}