import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../claim.service';
import { Claim } from '../../../models/claim.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { ChatbotComponent } from 'src/app/chatbot/chatbot.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService, User } from 'src/app/auth.service'; 


@Component({
  selector: 'app-list-claim-front',
  templateUrl: './list-claim-front.component.html',
  styleUrls: ['./list-claim-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent, NgxPaginationModule,ChatbotComponent]
})
export class ListClaimComponentFront implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  searchQuery: string = '';
  selectedSort: string = 'id';
  page: number = 1; // Variable pour la page actuelle
  pageSize: number = 3; // Nombre d'éléments par page
  showStatistics: boolean = false;

  constructor(private claimService: ClaimService, private router: Router,private authService: AuthService) {}
  currentUser: User | null = null;

  ngOnInit(): void {
    this.fetchClaims();
    this.currentUser = this.authService.getUser();

  }

  isCustomer(): boolean {
    return this.currentUser?.role === 'CUSTOMER';
  }

  isAgent(): boolean {
    return this.currentUser?.role === 'AGENT';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }
  fetchClaims(): void {
    this.currentUser = this.authService.getUser();
  
    if (!this.currentUser) {
      console.error('User not authenticated');
      return;
    }
  
    const isCustomer = this.currentUser.role === 'CUSTOMER';
  
    // Si CUSTOMER => passer l'userId, sinon appeler sans userId (admin ou agent)
    this.claimService.getAllClaims(isCustomer ? this.currentUser.id : undefined).subscribe(
      (data) => {
        this.claims = data;
        this.filteredClaims = [...this.claims];
      },
      (error) => {
        console.error('Error fetching claims:', error);
      }
    );
  }
  
  
  toggleStatistics(): void {
    this.showStatistics = !this.showStatistics;
  }

  getClaimCountByStatus(status: string): number {
    return this.claims.filter(claim => claim.statusClaim === status).length;
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
    this.page = 1; // Reset to page 1 after a search
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return '#ff9800'; // Orange pour "En attente"
      case 'APPROVED':
        return '#4caf50'; // Vert pour "Approuvée"
      case 'REJECTED':
        return '#f44336'; // Rouge pour "Rejetée"
      case 'IN_REVIEW':
        return '#2196f3'; // Bleu pour "En révision"
      default:
        return '#9e9e9e'; // Gris pour un statut inconnu
    }
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

  viewClaim(id: string): void {
    this.router.navigate([`/claimsFront/DetailsClaim/${id}`]);
  }

  editClaim(id: string): void {
    this.router.navigate([`/claimsFront/EditClaim/${id}`]);
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
      // Appel à la méthode deleteClaim avec id, userId, et role
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
  

  getTotalClaims(): number {
    return this.claims.length;
  }
  
  navigateToAddClaim(): void {
    this.router.navigate(['claimsFront/AddClaim']);
  }

  navigateToAssessments() {
    this.router.navigate(['/assessments']);
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
