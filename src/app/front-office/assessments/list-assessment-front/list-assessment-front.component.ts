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
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-list-assessment-front',
  templateUrl: './list-assessment-front.component.html',
  styleUrls: ['./list-assessment-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent, ChatbotComponent, NgxPaginationModule],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ListAssessmentComponentFront implements OnInit {
  assessments: Assessment[] = [];
  filteredAssessments: Assessment[] = [];
  searchQuery: string = '';
  selectedSort: string = 'assessmentDate';
  sortDirection: boolean = true;
  page: number = 1;
  pageSize: number = 6;
  currentUser: User | null = null;

  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private router: Router
  ) {}

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
      this.assessmentService.getAssessmentsByUser(userId, role).subscribe(
        (data) => {
          this.assessments = data;
          this.filteredAssessments = data;
        },
        (error) => {
          console.error('Error fetching customer assessments:', error);
        }
      );
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
    this.applySort();
  }

  viewAssessment(id: string): void {
    this.router.navigate([`/assessmentsFront/ViewAssessment/${id}`]);
  }

  editAssessment(id: string): void {
    this.router.navigate([`/admin/assessments/EditAssessment/${id}`]);
  }

  deleteAssessment(id: string): void {
    const userId = this.currentUser?.id;
    const role = this.currentUser?.role;
  
    if (userId && role && (this.isAdmin() || this.isAgent())) {
      if (confirm('Are you sure you want to delete this assessment?')) {
        this.assessmentService.deleteAssessment(id, userId, role).subscribe(
          () => {
            this.assessments = this.assessments.filter(assessment => assessment.idAssessment !== id);
            this.filteredAssessments = [...this.assessments];
            this.fetchAssessments();
          },
          (error) => {
            console.error('Error deleting assessment:', error);
          }
        );
      }
    } else {
      alert('You do not have permission to delete this assessment.');
    }
  }

  navigateToAddAssessment(): void {
    this.router.navigate(['assessmentsFront/AddAssessment']);
  }

  goBack(): void {
    this.router.navigate(['/claims']);
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'pending';
      case 'COMPLETED':
        return 'completed';
      case 'REJECTED':
        return 'rejected';
      case 'IN_REVIEW':
        return 'in-review';
      default:
        return '';
    }
  }
}