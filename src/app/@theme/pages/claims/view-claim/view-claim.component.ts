import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../../claim.service';
import { Claim, StatusClaim } from '../../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth.service';
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
    userId: 0,
    supportingDocuments: [],
    assessment: null
  };

  statusClaims = Object.values(StatusClaim);
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';
  claims: Claim[] = [];

  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
    
  ) {}

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    const user = this.authService.getUser(); 
    if (claimId && user) {
      const userId = user.id; 
      const role = user.role; 
  
      this.claimService.getClaimById(claimId, userId, role).subscribe(
        (data) => {
          console.log('FULL CLAIM:', data);
          this.claim = data;
          console.log('Claim data:', this.claim);
          console.log('Supporting documents:', this.claim.supportingDocuments);
        },
        (error) => {
          console.error('Error fetching claim details', error);
        }
      );
    } else {
      console.error('Claim ID or User is missing');
    }
  }
  
   editClaim(): void {
    this.router.navigate([`/admin/claims/EditClaim/${this.claim.idClaim}`]);
  }

  deleteClaim(id: string): void {
    const user = this.authService.getUser();
    if (!id || !user) {
      console.error('Invalid claim ID or user');
      return;
    }
  
    const userId = user.id;
    const role = user.role; 
  
    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.deleteClaim(id, userId, role).subscribe(() => {
        this.claims = this.claims.filter(claim => claim.idClaim !== id);
        this.router.navigate(['/admin/claims']);
      }, (error) => {
        console.error('Error deleting claim:', error);
      });
    }
  }
  
  viewAssessment(idClaim: string): void {
    const user = this.authService.getUser(); 
    if (!user) {
      console.error('User not authenticated');
      return;
    }
  
    const userId = user.id; 
    const role = user.role; 
  
    this.claimService.getClaimById(idClaim, userId, role).subscribe(
      (claim) => {
        if (claim && claim.assessment) {
          const idAssessment = claim.assessment.idAssessment;
          this.router.navigate([`/admin/assessments/ViewAssessment/${idAssessment}`]);
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
  goBack(): void {
    this.router.navigate(['/admin/claims'], { relativeTo: this.route });
  }
}
