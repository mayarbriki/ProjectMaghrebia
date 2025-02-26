import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../../claim.service';
import { Claim, StatusClaim } from '../../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-claim',
  templateUrl: './view-claim.component.html',
  styleUrls: ['./view-claim.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ViewClaimComponent implements OnInit {
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
}
