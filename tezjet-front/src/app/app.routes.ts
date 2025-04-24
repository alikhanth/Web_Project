import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { JourneySearchComponent } from './components/journey/journey-search/journey-search.component';
import { BookingCreateComponent } from './components/booking/booking-create/booking-create.component';
import { BookingListComponent } from './components/booking/booking-list/booking-list.component';
import { AboutUsComponent } from './components/about-us/about-us.component'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: JourneySearchComponent },
  { path: 'journey/:id', component: BookingCreateComponent }, 
  { path: 'about', component: AboutUsComponent },
  { path: 'bookings', component: BookingListComponent },
  { path: '**', redirectTo: '' }
];