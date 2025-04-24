import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journey } from '../interfaces/journey.interface';
import { Station } from '../interfaces/journey.interface';
import { AuthService } from './auth.service';  

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  private apiUrl = 'http://localhost:8000/api'; 
  

  constructor(private http: HttpClient,private authService: AuthService) {}

  searchJourneys(departureStationId: string, arrivalStationId: string, date: string): Observable<Journey[]> {
    return this.http.get<Journey[]>(`${this.apiUrl}/journeys/`, {
      params: {
        departure_station: departureStationId.toString(),
        arrival_station: arrivalStationId.toString(),
        date
      }
    });
  }

  getStations(): Observable<Station[]> { 
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.authService.getToken()}`  // 👈 Add token
    });
    return this.http.get<Station[]>(`${this.apiUrl}/stations/`);
  }

  getJourneyDetails(id: number): Observable<Journey> {
    return this.http.get<Journey>(`${this.apiUrl}/journeys/${id}/`);
  } 
  getJourneyById(id: number): Observable<Journey> {
    return this.http.get<Journey>(`/api/journeys/${id}`);
  }
  getMultipleJourneys(ids: number[]): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?ids=${ids.join(',')}`);
  }
}