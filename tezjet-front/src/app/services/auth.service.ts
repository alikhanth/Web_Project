import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface'; 
import { Router,RouterModule} from '@angular/router'

@Injectable({
  providedIn: 'root' 
  
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'auth_token';
  private userKey = 'current_user'; 
  

  constructor(private http: HttpClient, 
    private router: Router  // Inject Router
  ) { }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, { username, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response.user);
      })
    );
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/`, userData);
  }

  logout(): Observable<any> {
    // First call backend logout
    return this.http.post(`${this.apiUrl}/logout/`, {}).pipe(
      tap({
        next: () => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        },
        error: () => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        }
      })
    );
  } 
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}