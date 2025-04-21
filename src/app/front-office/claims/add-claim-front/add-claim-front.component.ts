import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../claim.service';
import { Claim, StatusClaim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { AuthService } from 'src/app/auth.service'; 


@Component({
  selector: 'app-add-claim-front',
  templateUrl: './add-claim-front.component.html',
  styleUrls: ['./add-claim-front.component.scss'],
  standalone: true, 
  imports: [CommonModule, FormsModule,HeaderFrontComponent,FooterFrontComponent]
})
export class AddClaimComponentFront implements OnInit {
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

  statusClaims = Object.values(StatusClaim); // Cette ligne peut être supprimée car on n'affiche plus le statut
  claimReasons = ['Accident', 'Natural Disaster', 'Property Damage', 'Medical Expenses', 'Other'];
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';
  fileName: string = '';
  currentUser: any;
  constructor(
    private claimService: ClaimService, 
    private router: Router,
    private authService: AuthService 
  ) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (this.currentUser) {
      this.claim.userId = this.currentUser.id; 
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

    const submissionDate = new Date(this.claim.submissionDate);
    if (!(submissionDate instanceof Date) || isNaN(submissionDate.getTime())) {
      console.error("Invalid submissionDate");
      alert("Please provide a valid submission date.");
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
    formData.append("userId", this.claim.userId.toString()); 

    this.selectedFiles.forEach((file, index) => {
      formData.append("supportingDocuments", file);
    });

    this.claimService.createClaim(formData).subscribe(response => {
      console.log('Claim created successfully', response);
      alert('Claim added successfully!');
      this.router.navigate(['/claims']);
    }, error => {
      console.error('Error creating claim', error);
      alert('Failed to create claim.');
    });
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

  goBack() : void {
    this.router.navigate(['/claims']);
  }
}
