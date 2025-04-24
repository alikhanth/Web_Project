import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JourneyService } from '../../../services/journey.service';
import { BookingService } from '../../../services/booking.service';
import { Journey } from '../../../interfaces/journey.interface';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html', 
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./booking-create.component.css']
})
export class BookingCreateComponent implements OnInit {
  journey: Journey | null = null;
  bookingForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private journeyService: JourneyService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      passenger_name: ['', Validators.required],
      passenger_email: ['', [Validators.required, Validators.email]],
      seats: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const journeyId = this.route.snapshot.paramMap.get('id');
    if (journeyId) {
      this.journeyService.getJourneyDetails(+journeyId).subscribe(journey => {
        this.journey = journey;
        this.bookingForm.patchValue({
          seats: 1
        });
      });
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.journey) {
      this.isLoading = true;
      const bookingData = {
        journey: this.journey.id,
        ...this.bookingForm.value
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (booking) => {
          this.isLoading = false;
          this.router.navigate(['/bookings', booking.id]);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || 'Booking failed. Please try again.';
        }
      });
    }
  }

  get totalPrice(): number {
    if (this.journey && this.bookingForm.get('seats')?.value) {
      return this.journey.price * this.bookingForm.get('seats')?.value;
    }
    return 0;
  }
}