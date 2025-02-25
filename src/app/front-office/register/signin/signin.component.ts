import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  signinForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSignin() {
    if (this.signinForm.invalid) {
      return;
    }

    const { username, password } = this.signinForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('User logged in:', response);

        // Check the role and redirect accordingly
        if (response.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else if (response.role === 'CUSTOMER') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Check your credentials.';
        console.error(err);
      }
    });
  }
}
