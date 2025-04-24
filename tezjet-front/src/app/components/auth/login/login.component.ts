import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router,RouterModule} from '@angular/router';
import { AuthService } from '../../../services/auth.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login', 
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}