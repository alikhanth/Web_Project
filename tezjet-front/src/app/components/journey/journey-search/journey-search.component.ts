import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { JourneyService } from '../../../services/journey.service';
import { Station } from '../../../interfaces/journey.interface';
import { Journey } from '../../../interfaces/journey.interface';
import { Router ,RouterModule} from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journey-search',
  templateUrl: './journey-search.component.html', 
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./journey-search.component.css']
})
export class JourneySearchComponent implements OnInit {
  searchForm: FormGroup;
  stations: Station[] = [];
  journeys: Journey[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private journeyService: JourneyService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      departureStation: [''],
      arrivalStation: [''],
      date: [new Date().toISOString().split('T')[0]]
    });
  }

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.journeyService.getStations().subscribe(stations => {
      this.stations = stations;
    });
  }

  searchJourneys(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      const { departureStation, arrivalStation, date } = this.searchForm.value;
      
      this.journeyService.searchJourneys(departureStation, arrivalStation, date).subscribe({
        next: (journeys) => {
          this.journeys = journeys;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  viewJourneyDetails(journeyId: number): void {
    this.router.navigate(['/journey', journeyId]);
  }
}