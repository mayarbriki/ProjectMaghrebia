import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../../claim.service';
import { Claim, StatusClaim } from '../../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


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
    supportingDocuments: [],
    assessment: null
  };

  statusClaims = Object.values(StatusClaim);
  claimReasons = ['Accident', 'Natural Disaster', 'Property Damage', 'Medical Expenses', 'Other'];
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';

  constructor(private claimService: ClaimService,private router: Router) {}

  ngOnInit(): void {}

  checkClaimReason(): void {
    if (this.claim.claimReason !== 'Other') {
      this.temporaryOtherClaimReason = ''; 
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    // Ensure submissionDate is a valid Date object
    const submissionDate = new Date(this.claim.submissionDate); // Make sure this is a Date object
    if (!(submissionDate instanceof Date) || isNaN(submissionDate.getTime())) {
      console.error("Invalid submissionDate");
      alert("Please provide a valid submission date.");
      return; // Stop the form submission
    }

    formData.append("fullName", this.claim.fullName);
    formData.append("claimName", this.claim.claimName);
    formData.append("submissionDate", submissionDate.toISOString());  // Use the valid Date object
    formData.append("statusClaim", this.claim.statusClaim);
    formData.append("claimReason", this.claim.claimReason);
    formData.append("description", this.claim.description);

    // Add files to formData
    this.selectedFiles.forEach((file, index) => {
      formData.append("supportingDocuments", file);
    });

    this.claimService.createClaim(formData).subscribe(response => {
      console.log('Claim created successfully', response);
      alert('Claim added successfully!');
      this.router.navigate(['/admin/claims']); // ✅ Redirection après succès
    }, error => {
      console.error('Error creating claim', error);
      alert('Failed to create claim.');
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/claims']);    
  }
  goBack(): void {
    this.router.navigate(['/admin/claims']);
  }
  
}
