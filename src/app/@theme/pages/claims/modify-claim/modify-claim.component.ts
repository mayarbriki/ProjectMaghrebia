import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../../claim.service';
import { Claim, StatusClaim } from '../../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modify-claim',
  templateUrl: './modify-claim.component.html',
  styleUrls: ['./modify-claim.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ModifyClaimComponent implements OnInit {
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

  statusClaims = Object.values(StatusClaim);
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';
  fileName: string = '';


  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    const user = this.authService.getUser();
    const userId = user ? user.id : null;
    const role = user ? user.role : 'ADMIN';  
  
    if (id && userId && role) {
      this.claimService.getClaimById(id, userId, role).subscribe({
        next: (data) => {
          this.claim = data;
        if (this.claim.submissionDate && typeof this.claim.submissionDate === 'string') {
          this.claim.submissionDate = new Date(this.claim.submissionDate);
        } 
        },
        error: (err) => {
          console.error('Error loading claim:', err);
          alert('Error retrieving claim.');
        }
      });
    } else {
      alert('Missing claim ID or user details');
      this.router.navigate(['/claims']);
    }
  }  
  
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.fileName = this.selectedFiles.length > 0 ? this.selectedFiles[0].name : ''; 
    }
  }

  
  onUpdate(): void {
    const formData = new FormData();
  
    if (!this.claim.submissionDate || isNaN(new Date(this.claim.submissionDate).getTime())) {
      alert("Invalid submission date.");
      return;
    }
  
    if (!this.claim.fullName || this.claim.fullName.trim().length === 0) {
      alert("Full Name is required.");
      return;
    }
  
    if (!this.claim.claimName || this.claim.claimName.trim().length === 0) {
      alert("Claim Name is required.");
      return;
    }
  
    if (!this.claim.claimReason || this.claim.claimReason.trim().length === 0) {
      alert("Claim Reason is required.");
      return;
    }
  
    if (!this.claim.description || this.claim.description.trim().length === 0) {
      alert("Claim Description is required.");
      return;
    }
  
    formData.append("idClaim", this.claim.idClaim);
    formData.append("fullName", this.claim.fullName);
    formData.append("userId", this.claim.userId.toString()); 
    formData.append("claimName", this.claim.claimName);
    formData.append("submissionDate", new Date(this.claim.submissionDate).toISOString());
    formData.append("statusClaim", this.claim.statusClaim);
    formData.append("claimReason", this.claim.claimReason);
    formData.append("description", this.claim.description);
  
    this.selectedFiles.forEach((file) => {
      formData.append("supportingDocuments", file);
    });
  
    const userId = this.authService.getUser()?.id; 

    if (!userId) {
      console.error('User ID is missing.');
      return;
    }

    const role = 'ADMIN'; 
  
    this.claimService.updateClaim(this.claim.idClaim, formData, userId, role).subscribe(
      () => {
        alert('Claim updated successfully!');
        this.router.navigate(['/admin/claims']);
      },
      (error) => {
        console.error("Error updating claim:", error);
        alert('Failed to update claim.');
      }
    );
}

  
  onCancel(): void {
    this.router.navigate(['/claims']);    
  }
  

  checkClaimReason(): void {
    if (this.claim.claimReason !== 'Other') {
      this.temporaryOtherClaimReason = '';
    }
  }
  goBack() : void {
    this.router.navigate(['/admin/claims']);
  }
}
