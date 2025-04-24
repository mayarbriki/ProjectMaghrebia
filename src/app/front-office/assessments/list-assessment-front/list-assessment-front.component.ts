import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Assessment } from '../../../models/assessment.model';
import { AssessmentService } from '../../../assessment.service';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { ChatbotComponent } from 'src/app/chatbot/chatbot.component';
import { AuthService, User } from 'src/app/auth.service'; 
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-list-assessment-front',
  templateUrl: './list-assessment-front.component.html',
  styleUrls: ['./list-assessment-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderFrontComponent,FooterFrontComponent,ChatbotComponent,NgxPaginationModule]
})
export class ListAssessmentComponentFront implements OnInit {
  assessments: Assessment[] = [];
  filteredAssessments: Assessment[] = [];
  searchQuery: string = '';
  selectedSort: string = 'assessmentDate'; // Default sorting by date
  sortDirection: boolean = true; // true for ascending, false for descending
  page: number = 1; // Variable pour la page actuelle
  pageSize: number = 4; // Nombre d'éléments par page
  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private router: Router
  ) {}
  currentUser: User | null = null;

  ngOnInit(): void {
    this.fetchAssessments();
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

  fetchAssessments(): void {
    const user = this.authService.getUser();
    const userId = user?.id;
    const role = user?.role;

    if (!userId || !role) {
      console.error('User ID or role is missing');
      return;
    }

    if (role === 'ADMIN' || role === 'AGENT') {
      // ADMIN and AGENT can view all assessments
      this.assessmentService.getAssessmentsByUser(userId, role).subscribe(
        (data) => {
          this.assessments = data;
          this.filteredAssessments = data;
        },
        (error) => {
          console.error('Error fetching assessments:', error);
        }
      );
    } else if (role === 'CUSTOMER') {
      // CUSTOMER can only view their own assessments
      this.assessmentService.getAssessmentsByUser(userId, role).subscribe(
        (data) => {
          this.assessments = data;
          this.filteredAssessments = data;
        },
        (error) => {
          console.error('Error fetching customer assessments:', error);
        }
      );
    } else {
      console.error('Role is not recognized.');
    }
  }

  applySearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredAssessments = this.assessments.filter(assessment =>
      assessment.claim?.claimName?.toLowerCase().includes(query) ||
      new Date(assessment.assessmentDate).toISOString().includes(query) ||
      assessment.statusAssessment?.toLowerCase().includes(query) ||
      assessment.finalDecision?.toLowerCase().includes(query)
    );
    this.applySort(); 
    this.page = 1;
  }
  
  
  applySort(): void {
    if (this.selectedSort === 'assessmentDate') {
      this.filteredAssessments.sort((a, b) => {
        const dateA = new Date(a.assessmentDate).getTime();
        const dateB = new Date(b.assessmentDate).getTime();
        return this.sortDirection ? dateA - dateB : dateB - dateA;
      });
    } else if (this.selectedSort === 'claimName') {
      this.filteredAssessments.sort((a, b) => {
        const nameA = a.claim?.claimName?.toLowerCase() || '';
        const nameB = b.claim?.claimName?.toLowerCase() || '';
        return this.sortDirection ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    }
  }
  

  toggleSortDirection(): void {
    this.sortDirection = !this.sortDirection;
    this.applySort(); // Reapply sorting after direction toggle
  }

  viewAssessment(id: string): void {
    this.router.navigate([`/assessmentsFront/ViewAssessment/${id}`]);
  }

  editAssessment(id: string): void {
    this.router.navigate([`/admin/assessments/EditAssessment/${id}`]);
  }

  deleteAssessment(id: string): void {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.assessmentService.deleteAssessment(id).subscribe(() => {
        this.assessments = this.assessments.filter(assessment => assessment.idAssessment !== id);
        this.applySearch(); // Reapply search after deletion
      }, (error) => {
        console.error('Error deleting assessment:', error);
      });
    }
  }

  navigateToAddAssessment(): void {
    this.router.navigate(['assessmentsFront/AddAssessment']);
  }

  goBack() : void {
    this.router.navigate(['/claims']);
  }
}
