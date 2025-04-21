import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../../claim.service';
import { AssessmentService } from '../../../../assessment.service';
import { Claim,StatusClaim } from '../../../../models/claim.model';
import { Assessment } from '../../../../models/assessment.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService, User } from 'src/app/auth.service'; 


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
  statusOptions = Object.values(StatusClaim);

statusClaims = Object.values(StatusClaim);
currentUser: User | null = null;

  constructor(
    private claimService: ClaimService, 
    private authService: AuthService,
    private assessmentService: AssessmentService, 
    private router: Router,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.fetchClaims();
    this.currentUser = this.authService.getUser();
  }

  fetchClaims(): void {
    this.currentUser = this.authService.getUser();
  
    if (!this.currentUser) {
      console.error('User not authenticated');
      return;
    }
      this.claimService.getAllClaims().subscribe(
      (data) => {
        this.claims = data;
        this.filteredClaims = [...this.claims];
      },
      (error) => {
        console.error('Error fetching claims:', error);
      }
    );
  }
  
  updatingClaims: Set<string> = new Set();

  changeStatus(claim: Claim, selectedStatus: string): void {
    if (claim.statusClaim === selectedStatus) return; // Rien à faire si le statut est déjà sélectionné
    
    const confirmation = confirm('Are you sure you want to update the status of this claim?');
    if (!confirmation) return;
  
    const user = this.authService.getUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
  
    const userId = user.id;
    const role = user.role; 
  
    this.updatingClaims.add(claim.idClaim);
    this.claimService.updateClaimStatus(claim.idClaim, selectedStatus, userId, role).subscribe(
      (updatedClaim) => {
        claim.statusClaim = updatedClaim.statusClaim;
        this.updatingClaims.delete(claim.idClaim);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur mise à jour statut:', error);
        this.updatingClaims.delete(claim.idClaim);
      }
    );
  }
 
  applySearch(): void {
    this.filteredClaims = this.claims.filter(claim =>
      claim.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.claimName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.claimReason.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.statusClaim.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      new Date(claim.submissionDate).toISOString().includes(this.searchQuery) 

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
    this.applySort();
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
  
    const user = this.authService.getUser(); 
    if (!user) {
      console.error('User not authenticated');
      return;
    }
  
    const userId = user.id; 
    const role = user.role; 
  
    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.deleteClaim(id, userId, role).subscribe(
        () => {
          this.claims = this.claims.filter(claim => claim.idClaim !== id);
          this.applySearch(); 
        },
        (error) => {
          console.error('Error deleting claim:', error);
        }
      );
    }
  }  

  navigateToAddClaim(): void {
    this.router.navigate(['admin/claims/AddClaim']);
  }

 
  viewAssessment(idClaim: string): void {
    const user = this.authService.getUser(); 
    if (!user) {
      console.error('User not authenticated');
      alert('User not authenticated. Please log in.');
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
  
}
