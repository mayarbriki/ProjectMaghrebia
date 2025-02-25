import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required], // ✅ Ensure address is included
      file: [null]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
  
    const user = {
      username: this.signupForm.value.fullname,
      email: this.signupForm.value.email,
      phoneNumber: this.signupForm.value.phoneNumber, // ✅ Add this
      address: this.signupForm.value.address, // ✅ Add this
      password: this.signupForm.value.password
    };
  
    this.authService.register(user, this.selectedFile ?? undefined).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Try again.';
        console.error(err);
      }
    });
  }    
  
}
