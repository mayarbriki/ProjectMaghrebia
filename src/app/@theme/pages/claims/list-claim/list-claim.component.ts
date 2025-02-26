import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../../claim.service';
import { Claim } from '../../../../models/claim.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private claimService: ClaimService, private router: Router) {}

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
        console.error(' Error fetching claims:', error);
      }
    );
  }

  applySearch(): void {
    this.filteredClaims = this.claims.filter(claim =>
      claim.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      claim.claimName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  applySort(): void {
    if (this.selectedSort === 'id') {
      this.filteredClaims.sort((a, b) => a.idClaim.localeCompare(b.idClaim));
    } else if (this.selectedSort === 'name') {
      this.filteredClaims.sort((a, b) => a.claimName.localeCompare(b.claimName));
    } else if (this.selectedSort === 'date') {
      this.filteredClaims.sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());
    }
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
        this.applySearch(); // Reapply search after deletion
      }, (error) => {
        console.error('Error deleting claim:', error);
      });
    }
  }

  navigateToAddClaim(): void {
    this.router.navigate(['admin/claims/AddClaim']);
  }
}
