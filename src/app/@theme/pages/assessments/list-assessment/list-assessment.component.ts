import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Assessment } from '../../../../models/assessment.model';
import { AssessmentService } from '../../../../assessment.service';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../../../auth.service";
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-list-assessment',
  templateUrl: './list-assessment.component.html',
  styleUrls: ['./list-assessment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule]
})
export class ListAssessmentComponent implements OnInit {
  assessments: Assessment[] = [];
  filteredAssessments: Assessment[] = [];
  searchQuery: string = '';
  selectedSort: string = 'assessmentDate'; // Default sorting by date
  sortDirection: boolean = true; // true for ascending, false for descending
  page: number = 1; // Variable pour la page actuelle
  pageSize: number = 6; // Nombre d'éléments par page
  
  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAssessments();
  }

  fetchAssessments(): void {
    const user = this.authService.getUser(); 
    const userId = user?.id;
    const role = user?.role;
  
    if (!userId || !role) {
      console.error('User ID or role is missing');
      return;
    }
  
    this.assessmentService.getAssessmentsByUser(userId, role).subscribe(
      (data) => {
        this.assessments = data;
        this.filteredAssessments = data;
      },
      (error) => {
        console.error('Error fetching assessments:', error);
      }
    );
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
    this.router.navigate([`/admin/assessments/ViewAssessment/${id}`]);
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
    this.router.navigate(['admin/assessments/AddAssessment']);
  }

  statusOptions: string[] = ['PENDING', 'COMPLETED', 'REJECTED'];
  decisionOptions: string[] = ['IN_REVIEW','APPROVED', 'REJECTED'];
  updatingAssessments: Set<string> = new Set();
  changeStatus(assessment: Assessment, selectedStatus: string) {
    if (assessment.statusAssessment === selectedStatus) return;
  
    const confirmChange = confirm('Are you sure you want to update the status?');
    if (!confirmChange) return;
  
    this.updatingAssessments.add(assessment.idAssessment);
  
    this.assessmentService.updateStatus(assessment.idAssessment, selectedStatus).subscribe(
      updated => {
        assessment.statusAssessment = updated.statusAssessment;
        this.updatingAssessments.delete(assessment.idAssessment);
      },
      error => {
        console.error('Error updating status:', error);
        this.updatingAssessments.delete(assessment.idAssessment);
      }
    );
  }
  
  changeFinalDecision(assessment: Assessment, selectedDecision: string) {
    if (assessment.finalDecision === selectedDecision) return;
  
    const confirmChange = confirm('Are you sure you want to update the final decision?');
    if (!confirmChange) return;
  
    this.updatingAssessments.add(assessment.idAssessment);
  
    this.assessmentService.updateFinalDecision(assessment.idAssessment, selectedDecision).subscribe(
      updated => {
        assessment.finalDecision = updated.finalDecision;
        this.updatingAssessments.delete(assessment.idAssessment);
      },
      error => {
        console.error('Error updating decision:', error);
        this.updatingAssessments.delete(assessment.idAssessment);
      }
    );
  }
  
}
