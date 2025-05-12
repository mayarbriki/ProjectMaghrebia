import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PredictionRequest, PredictionResponse, PredictionService } from '../prediction.service';
import { HeaderFrontComponent } from '../front-office/header-front/header-front.component';

interface Product {
  id_product: number;
  category: string;
  description: string;
  file_name?: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-recommendation-form',
  templateUrl: './product-recommendation-form.component.html',
  styleUrls: ['./product-recommendation-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeaderFrontComponent
  ]
})
export class ProductRecommendationFormComponent implements OnInit {
  predictionForm: FormGroup;
  prediction: PredictionResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  currentStep = 1;

  products: Product[] = [
    {
      id_product: 1,
      category: 'HEALTHCARE',
      description: 'Comprehensive coverage for medical expenses, including hospital stays and doctor visits.',
      name: 'Medical coverage',
      price: 10000
    },
    {
      id_product: 2,
      category: 'VEHICLE',
      description: 'Protection for your vehicle against accidents, theft, and damages.',
   
      name: 'Vehicle coverage',
      price: 10000
    },
    {
      id_product: 3,
      category: 'Real Estate',
      description: 'Coverage for your home or property against damages and liabilities.',
      name: 'Real estate coverage',   
     
      price: 10000
    }
  ];

  selectedProduct: Product | null = null;
  showModal: boolean = false;

  regions = ['Ariana', 'Beja', 'Ben Arous', 'Bizerte', 'Gabes', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine',
    'Kebili', 'Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
    'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'];
  genders = ['Female', 'Male'];
  maritalStatuses = ['Divorced', 'Married', 'Single', 'Widowed'];
  occupations = ['Administrative', 'Engineer', 'Executive', 'Other', 'Sales', 'Self-employed', 'Student', 'Technician'];
  yesNoOptions = ['Yes', 'No'];
  marketingInteractions = ['Email', 'None', 'Phone', 'SMS', 'Social Media'];
  communicationChannels = ['Email', 'Phone', 'SMS'];
  productOptions = ['Auto', 'Health', 'None', 'Real Estate'];

  private productRecommendations: { [key: string]: { description: string, cta: string } } = {
    'Auto': {
      description: 'Protect your vehicle with our comprehensive Auto Insurance. Enjoy peace of mind with coverage for accidents, theft, and more.',
      cta: 'Get a Quote for Auto Insurance'
    },
    'Health': {
      description: 'Stay covered with our Health Insurance plans. Access top medical care and protect your well-being with flexible options.',
      cta: 'Explore Health Plans'
    },
    'Real Estate': {
      description: 'Safeguard your property with our Real Estate Insurance. Protect your home or investment from unexpected damages.',
      cta: 'Learn About Property Coverage'
    },
    'None': {
      description: 'Based on your profile, we recommend exploring our range of services to find the perfect fit for your needs.',
      cta: 'Browse All Services'
    }
  };

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

  ngOnInit(): void {}

  openModal(product: Product): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }

  // Updated method to safely handle null prediction
  getRecommendedProduct(): Product | null {
    if (!this.prediction || !this.prediction.prediction) {
      return null;
    }
    return this.products.find(p => p.name.toLowerCase() === this.prediction?.prediction.toLowerCase()) || null;
  }

  getRecommendation(): { description: string, cta: string } {
    const product = this.prediction?.prediction || 'None';
    return this.productRecommendations[product] || this.productRecommendations['None'];
  }

  nextStep(step: number): void {
    this.currentStep = step;
  }

  prevStep(step: number): void {
    this.currentStep = step;
  }

  updateCheckbox(event: Event, controlName: string): void {
    const checkbox = event.target as HTMLInputElement;
    this.predictionForm.get(controlName)?.setValue(checkbox.checked ? 1 : 0);
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
        const recommendedProduct = this.getRecommendedProduct();
        if (recommendedProduct) {
          this.openModal(recommendedProduct);
        } else {
        }
      },
      error: (error) => {
        console.error('Error making recommendation:', error);
        this.errorMessage = 'An error occurred while making the recommendation. Please try again.';
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
    this.currentStep = 1;
    this.closeModal();
  }
}