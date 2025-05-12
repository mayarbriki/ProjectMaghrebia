import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PredictionRequest, PredictionResponse, PredictionService } from '../prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class PredictionComponent implements OnInit {
  predictionForm: FormGroup;
  prediction: PredictionResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  // Define form selections based on the Flask API's categorical values
  regions = ['Ariana', 'Beja', 'Ben Arous', 'Bizerte', 'Gabes', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine',
    'Kebili', 'Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
    'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'];
  
  genders = ['Female', 'Male'];
  
  maritalStatuses = ['Divorced', 'Married', 'Single', 'Widowed'];
  
  occupations = ['Administrative', 'Engineer', 'Executive', 'Other', 'Sales', 'Self-employed', 'Student',
    'Technician'];
  
  yesNoOptions = ['Yes', 'No'];
  
  marketingInteractions = ['Email', 'None', 'Phone', 'SMS', 'Social Media'];
  
  communicationChannels = ['Email', 'Phone', 'SMS'];
  
  productOptions = ['Auto', 'Health', 'None', 'Real Estate'];

  constructor(
    private fb: FormBuilder,
    private predictionService: PredictionService
  ) {
    this.predictionForm = this.fb.group({
      age: [30, [Validators.required, Validators.min(18), Validators.max(100)]],
      gender: ['Male', Validators.required],
      region: ['Tunis', Validators.required],
      maritalStatus: ['Single', Validators.required],
      occupation: ['Engineer', Validators.required],
      incomeLevel: [50000, [Validators.required, Validators.min(0)]],
      tenureYears: [5, [Validators.required, Validators.min(0), Validators.max(50)]],
      satisfactionScore: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      interestedInOtherProducts: ['Yes', Validators.required],
      marketingInteraction: ['Email', Validators.required],
      preferredCommunicationChannel: ['Email', Validators.required],
      purchaseAmount: [5000, [Validators.required, Validators.min(0)]],
      isBookmarked: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
      currentProduct: ['None', Validators.required],
      bookmarkedService: ['None', Validators.required],
      isHealthViewed: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      isAutoViewed: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      isRealEstateViewed: [0, [Validators.required, Validators.min(0), Validators.max(1)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.predictionForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    const formData = this.predictionForm.value as PredictionRequest;
    this.isLoading = true;
    this.errorMessage = null;

    this.predictionService.getPrediction(formData).subscribe({
      next: (response) => {
        this.prediction = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error making prediction:', error);
        this.errorMessage = 'An error occurred while making the prediction. Please try again.';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.predictionForm.reset({
      age: 30,
      gender: 'Male',
      region: 'Tunis',
      maritalStatus: 'Single',
      occupation: 'Engineer',
      incomeLevel: 50000,
      tenureYears: 5,
      satisfactionScore: 4,
      interestedInOtherProducts: 'Yes',
      marketingInteraction: 'Email',
      preferredCommunicationChannel: 'Email',
      purchaseAmount: 5000,
      isBookmarked: 1,
      currentProduct: 'None',
      bookmarkedService: 'None',
      isHealthViewed: 0,
      isAutoViewed: 0,
      isRealEstateViewed: 0
    });
    this.prediction = null;
    this.errorMessage = null;
  }
}