import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../claim.service';
import { Claim, StatusClaim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';


@Component({
  selector: 'app-view-claim-front',
  templateUrl: './view-claim-front.component.html',
  styleUrls: ['./view-claim-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderFrontComponent,FooterFrontComponent]
})
export class ViewClaimComponentFront implements OnInit {
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
      this.claimService.getClaimById(claimId).subscribe(
        (data) => {
          this.claim = data;
        },
        (error) => {
          console.error('Error fetching claim details', error);
        }
      );
    }
  }
  editClaim(): void {
    this.router.navigate([`/admin/claims/EditClaim/${this.claim.idClaim}`]);
  }

  deleteClaim(): void {
    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.deleteClaim(this.claim.idClaim).subscribe(
        () => {
          this.router.navigate(['/admin/claims']);
        },
        (error) => {
          console.error('Error deleting claim:', error);
        }
      );
    }
  }
  viewAssessment(idClaim: string): void {
    this.claimService.getClaimById(idClaim).subscribe(
      (claim) => {
        if (claim && claim.assessment) {
          const idAssessment = claim.assessment.idAssessment;
          this.router.navigate([`/assessmentsFront/ViewAssessment/${idAssessment}`]); 
        } else {
          alert('No assessment found for this claim.');
        }
      },
      (error) => {
        console.error('Error fetching claim:', error);
        if (error.status === 404) {
          alert('Claim not found.');
        } else {
          alert('Server error. Please try again later.');
        }
      }
    );
  }
}
