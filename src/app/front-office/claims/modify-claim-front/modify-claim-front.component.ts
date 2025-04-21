import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../claim.service';
import { Claim, StatusClaim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modify-claim-front',
  templateUrl: './modify-claim-front.component.html',
  styleUrls: ['./modify-claim-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent]
})
export class ModifyClaimComponentFront implements OnInit {
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

  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';
  fileName: string = '';

  constructor(
    private claimService: ClaimService, 
    private authService: AuthService,
    private router: Router, 
    private route: ActivatedRoute) {}

    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      const user = this.authService.getUser(); 
    
      if (id && user) {
        this.claimService.getClaimById(id, user.id, user.role).subscribe({
          next: (data) => {
            this.claim = data;
          },
          error: (err) => {
            console.error('Error loading claim:', err);
            alert('Error retrieving claim.');
          }
        });
      } else {
        alert('Missing claim ID or user information');
        this.router.navigate(['/claims']);
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

  onUpdate(): void {
    const formData = new FormData();
  
    if (!this.claim.fullName || this.claim.fullName.trim().length === 0) {
      alert("Full Name is required.");
      return;
    }
  
    if (!this.claim.claimName || this.claim.claimName.trim().length === 0) {
      alert("Claim Name is required.");
      return;
    }
  
    const submissionDate = new Date(this.claim.submissionDate);
    if (!(submissionDate instanceof Date) || isNaN(submissionDate.getTime())) {
      alert("Please provide a valid submission date.");
      return;
    }
  
    if (!this.claim.claimReason) {
      alert("Claim Reason is required.");
      return;
    }
  
    if (!this.claim.description || this.claim.description.trim().length === 0) {
      alert("Claim Description is required.");
      return;
    }
  
    if (this.claim.claimReason === 'Other' && !this.temporaryOtherClaimReason) {
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
  
    const user = this.authService.getUser(); 
    if (!user) {
      alert('User is not authenticated.');
      return;
    }
  
    this.claimService.updateClaim(this.claim.idClaim, formData, user.id, user.role).subscribe(response => {
      alert('Claim updated successfully!');
      this.router.navigate(['/claims']);
    }, error => {
      alert('Failed to update claim.');
    });
  }  

  onCancel(): void {
    this.router.navigate(['/claims']);
  }

  goBack(): void {
    this.router.navigate(['/claims']);
  }
}
