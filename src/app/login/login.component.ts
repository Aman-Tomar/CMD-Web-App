import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../models/Login/login.model';
import { AuthserviceService } from '../services/auth/authservice.service';
import { TokenService } from '../services/token/token.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgClass,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  errorMessage='';
  successMessage='';
  isLoading = false;
  loggedIn=false;

  constructor(private authService: AuthserviceService,private tokenService: TokenService,private router:Router) {}
  
  get Email()
  {
    return this.loginForm.get("email");
  }
  
  get Password()
  {
    return this.loginForm.get("password");
  }

  

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: Login = {
        Email: this.loginForm.value.email!,
        Password: this.loginForm.value.password!
      }
      this.isLoading = true; // Show loader

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.tokenService.setToken(response.token);
          this.successMessage = `Login successful for email ${loginData.Email}`;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500); // Redirect after 1.5 seconds
        },
        error: (err) => {
          this.isLoading = false; 
          this.errorMessage = 'Login failed! Please try again.';
        },
        complete: () => {
          this.isLoading = false; // Hide loader
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
