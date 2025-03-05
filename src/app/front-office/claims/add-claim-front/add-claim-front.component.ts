import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../claim.service';
import { Claim, StatusClaim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';


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
    statusClaim: StatusClaim.PENDING, // Par défaut le statut est PENDING
    claimReason: '',
    description: '',
    supportingDocuments: [],
    assessment: null
  };

  statusClaims = Object.values(StatusClaim); // Cette ligne peut être supprimée car on n'affiche plus le statut
  claimReasons = ['Accident', 'Natural Disaster', 'Property Damage', 'Medical Expenses', 'Other'];
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';
  fileName: string = '';

  constructor(private claimService: ClaimService, private router: Router) {}

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
      this.fileName = this.selectedFiles.length > 0 ? this.selectedFiles[0].name : ''; // Update file name
    }
  }



  onSubmit(): void {
    const formData = new FormData();

    // Ensure submissionDate is a valid Date object
    const submissionDate = new Date(this.claim.submissionDate); 
    if (!(submissionDate instanceof Date) || isNaN(submissionDate.getTime())) {
      console.error("Invalid submissionDate");
      alert("Please provide a valid submission date.");
      return; 
    }

    formData.append("fullName", this.claim.fullName);
    formData.append("claimName", this.claim.claimName);
    formData.append("submissionDate", submissionDate.toISOString());  
    formData.append("statusClaim", this.claim.statusClaim); // Statut est toujours PENDING au début
    formData.append("claimReason", this.claim.claimReason);
    formData.append("description", this.claim.description);

    // Ajouter les fichiers à formData
    this.selectedFiles.forEach((file, index) => {
      formData.append("supportingDocuments", file);
    });

    this.claimService.createClaim(formData).subscribe(response => {
      console.log('Claim created successfully', response);
      alert('Claim added successfully!');
      this.router.navigate(['/claims']); // ✅ Redirection après succès
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
      statusClaim: StatusClaim.PENDING, // Réinitialisation du statut à PENDING
      claimReason: '',
      description: '',
      supportingDocuments: [],
      assessment: null
    };
    this.selectedFiles = []; 
    this.temporaryOtherClaimReason = '';
  }

  onBack(): void {
    this.router.navigate(['/claims']);
  }
}
