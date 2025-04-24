import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../interfaces/booking.interface';
import { AuthService } from '../../../services/auth.service';  
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';  
import { forkJoin, switchMap, map } from 'rxjs'; // Add this at the top 
import { JourneyService } from '../../../services/journey.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html', 
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService, 
    private journeyService: JourneyService // ✅ Add this line
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadBookings();
    }
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  cancelBooking(id: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (err) => {
          console.error('Error cancelling booking:', err);
        }
      });
    }
  }
}