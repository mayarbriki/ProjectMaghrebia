import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../../claim.service';
import { Claim, StatusClaim } from '../../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    supportingDocuments: [],
    assessment: null
  };

  statusClaims = Object.values(StatusClaim);
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';

  constructor(
    private claimService: ClaimService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    if (claimId) {
      this.claimService.getClaimById(claimId).subscribe((data) => {
        this.claim = data;
  
        // Vérifier si submissionDate est défini et le convertir en objet Date
        if (this.claim.submissionDate && typeof this.claim.submissionDate === 'string') {
          this.claim.submissionDate = new Date(this.claim.submissionDate);
        }
      }, error => {
        console.error("Error fetching claim:", error);
      });
    }
  }
  
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }
  
  onUpdate(): void {
    const formData = new FormData();
  
    if (!this.claim.submissionDate || isNaN(new Date(this.claim.submissionDate).getTime())) {
      alert("Invalid submission date.");
      return;
    }
  
    formData.append("idClaim", this.claim.idClaim);
    formData.append("fullName", this.claim.fullName);
    formData.append("claimName", this.claim.claimName);
    formData.append("submissionDate", new Date(this.claim.submissionDate).toISOString()); // Assurer que c'est un Date valide
    formData.append("statusClaim", this.claim.statusClaim);
    formData.append("claimReason", this.claim.claimReason);
    formData.append("description", this.claim.description);
  
    // Ajout des fichiers au formulaire
    this.selectedFiles.forEach((file) => {
      formData.append("supportingDocuments", file);
    });
  
    this.claimService.updateClaim(this.claim.idClaim, formData).subscribe(() => {
      alert('Claim updated successfully!');
      this.router.navigate(['/admin/claims']);
    }, error => {
      console.error("Error updating claim:", error);
      alert('Failed to update claim.');
    });
  }
  
  
  onCancel(): void {
    this.router.navigate(['/admin/claims']);    
  }
  

  checkClaimReason(): void {
    if (this.claim.claimReason !== 'Other') {
      this.temporaryOtherClaimReason = '';
    }
  }
}
