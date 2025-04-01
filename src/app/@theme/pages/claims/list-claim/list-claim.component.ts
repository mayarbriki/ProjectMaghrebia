import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../../claim.service';
import { AssessmentService } from '../../../../assessment.service'; // Import du service d'évaluation
import { Claim,StatusClaim } from '../../../../models/claim.model';
import { Assessment } from '../../../../models/assessment.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-list-claim',
  templateUrl: './list-claim.component.html',
  styleUrls: ['./list-claim.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ListClaimComponent implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  searchQuery: string = '';
  selectedSort: string = 'id';
  sortDirection: boolean = true; 
  statusOptions = Object.values(StatusClaim); // Récupérer les valeurs de StatusClaim
  // true for ascending, false for descending

// Define the list of possible claim statuses
statusClaims = Object.values(StatusClaim);
  constructor(
    private claimService: ClaimService, 
    private assessmentService: AssessmentService, // Ajout du service d'évaluation
    private router: Router,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.fetchClaims();
  }

  fetchClaims(): void {
    this.claimService.getAllClaims().subscribe(
      (data) => {
        this.claims = data;
        this.filteredClaims = data;
      },
      (error) => {
        console.error('Error fetching claims:', error);
      }
    );
  }

  changeStatus(claim: Claim, newStatus: string) {
    const confirmation = confirm('Are you sure you want to update the status of this claim?');
  
    if (confirmation) {
      // Check if the status is different before sending the update
      if (claim.statusClaim !== newStatus) {
        this.claimService.updateClaimStatus(claim.idClaim, newStatus).subscribe(
          (updatedClaim) => {
            // Update the claim's status in the UI after the backend update
            const index = this.claims.findIndex(c => c.idClaim === claim.idClaim);
            if (index !== -1) {
              // Update the status locally
              this.claims[index].statusClaim = updatedClaim.statusClaim;
              this.filteredClaims = [...this.claims]; // Trigger change detection for filtered claims
              
              // Manually trigger Angular change detection
              this.cdr.detectChanges();
            }
            console.log('Status updated successfully:', updatedClaim.statusClaim);
          },
          (error) => {
            console.error('Error updating status:', error);
          }
        );
      }
    }
  }
  


  applySearch(): void {
    this.filteredClaims = this.claims.filter(claim =>
      claim.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.claimName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.claimReason.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.statusClaim.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      new Date(claim.submissionDate).toISOString().includes(this.searchQuery) // Search by assessment date

    );
  }
 

  applySort(): void {
    if (this.selectedSort === 'id') {
      this.filteredClaims.sort((a, b) => a.idClaim.localeCompare(b.idClaim));
    } else if (this.selectedSort === 'name') {
      this.filteredClaims.sort((a, b) => a.claimName.localeCompare(b.claimName));
    } else if (this.selectedSort === 'date') {
      this.filteredClaims.sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());
    } else if (this.selectedSort === 'fullName') {
      this.filteredClaims.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
  }
  

  toggleSortDirection(): void {
    this.sortDirection = !this.sortDirection;
    this.applySort(); // Reapply sorting after direction toggle
  }


  viewClaim(id: string): void {
    this.router.navigate([`/admin/claims/DetailsClaim/${id}`]);
  }

  editClaim(id: string): void {
    this.router.navigate([`/admin/claims/EditClaim/${id}`]);
  }

  deleteClaim(id: string): void {
    if (!id) {
      console.error('Invalid claim ID');
      return;
    }

    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.deleteClaim(id).subscribe(() => {
        this.claims = this.claims.filter(claim => claim.idClaim !== id);
        this.applySearch();
      }, (error) => {
        console.error('Error deleting claim:', error);
      });
    }
  }

  navigateToAddClaim(): void {
    this.router.navigate(['admin/claims/AddClaim']);
  }

 
  viewAssessment(idClaim: string): void {
    this.claimService.getClaimById(idClaim).subscribe(
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
  
  
}
