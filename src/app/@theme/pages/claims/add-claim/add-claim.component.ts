import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../../claim.service';
import { Claim, StatusClaim } from '../../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/auth.service';

@Component({
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddClaimComponent implements OnInit {
  claim: Claim = {
    idClaim: '',
    fullName: '',
    claimName: '',
    submissionDate: new Date(),
    statusClaim: StatusClaim.PENDING,
    claimReason: '',
    description: '',
    userId: 0,
    supportingDocuments: [],
    assessment: null
  };

  claimReasons = ['Accident', 'Natural Disaster', 'Property Damage', 'Medical Expenses', 'Other'];
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';
  fileName: string = '';
  currentUser: User | null = null;

  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
      alert("Access denied. Only admins can add claims from back-office.");
      this.router.navigate(['/admin/claims']); 
    }
  }

  checkClaimReason(): void {
    if (this.claim.claimReason !== 'Other') {
      this.temporaryOtherClaimReason = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.fileName = this.selectedFiles.length > 0 ? this.selectedFiles[0].name : '';
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    // Validation de la date
    const submissionDate = new Date(this.claim.submissionDate);
    if (!(submissionDate instanceof Date) || isNaN(submissionDate.getTime())) {
      alert("Please provide a valid submission date.");
      return;
    }

    if (!this.claim.fullName.trim()) {
      alert("Full Name is required.");
      return;
    }

    if (!this.claim.claimName.trim()) {
      alert("Claim Name is required.");
      return;
    }

    if (!this.claim.claimReason) {
      alert("Claim Reason is required.");
      return;
    }

    if (!this.claim.description.trim()) {
      alert("Claim Description is required.");
      return;
    }

    if (this.claim.claimReason === 'Other' && !this.temporaryOtherClaimReason.trim()) {
      alert("Please specify the other reason.");
      return;
    }

    formData.append("fullName", this.claim.fullName);
    formData.append("claimName", this.claim.claimName);
    formData.append("submissionDate", submissionDate.toISOString());
    formData.append("statusClaim", this.claim.statusClaim);
    formData.append("claimReason", this.claim.claimReason);
    formData.append("description", this.claim.description);

    this.selectedFiles.forEach((file) => {
      formData.append("supportingDocuments", file);
    });

    this.claimService.createClaim(formData).subscribe(
      response => {
        console.log('Claim created successfully', response);
        alert('Claim added successfully!');
        this.router.navigate(['/admin/claims']);
      },
      error => {
        console.error('Error creating claim', error);
        alert('Failed to create claim.');
      }
    );
  }

  onCancel(): void {
    this.claim = {
      idClaim: '',
      fullName: '',
      claimName: '',
      submissionDate: new Date(),
      statusClaim: StatusClaim.PENDING,
      claimReason: '',
      description: '',
      userId: 0,
      supportingDocuments: [],
      assessment: null
    };
    this.selectedFiles = [];
    this.temporaryOtherClaimReason = '';
  }

  goBack(): void {
    this.router.navigate(['/admin/claims']);
  }
}
