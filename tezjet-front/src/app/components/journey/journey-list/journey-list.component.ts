import { Component, OnInit } from '@angular/core';
import { JourneyService } from '../../../services/journey.service';
import { Journey } from '../../../interfaces/journey.interface';

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.component.html',
  styleUrls: ['./journey-list.component.css']
})
export class JourneyListComponent implements OnInit {
  journeys: Journey[] = [];
  isLoading = false;

  constructor(private journeyService: JourneyService) {}

  ngOnInit(): void {
    this.loadPopularJourneys();
  }

  loadPopularJourneys(): void {
    this.isLoading = true;
    this.journeyService.getStations().subscribe(stations => {
      if (stations.length >= 2) {
        this.journeyService.searchJourneys(stations[0].id, stations[1].id, new Date().toISOString().split('T')[0])
          .subscribe({
            next: (journeys) => {
              this.journeys = journeys.slice(0, 3);
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            }
          });
      }
    });
  }
}