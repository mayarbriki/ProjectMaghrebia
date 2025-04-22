import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Assessment } from '../../../../models/assessment.model';
import { AssessmentService } from '../../../../assessment.service';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../../../auth.service";
@Component({
  selector: 'app-list-assessment',
  templateUrl: './list-assessment.component.html',
  styleUrls: ['./list-assessment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ListAssessmentComponent implements OnInit {
  assessments: Assessment[] = [];
  filteredAssessments: Assessment[] = [];
  searchQuery: string = '';
  selectedSort: string = 'assessmentDate'; // Default sorting by date
  sortDirection: boolean = true; // true for ascending, false for descending

  
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
    this.filteredAssessments = this.assessments.filter(assessment =>
      assessment.idAssessment.toLowerCase().includes(this.searchQuery.toLowerCase()) ||  // Search by assessment ID
      assessment.statusAssessment.toLowerCase().includes(this.searchQuery.toLowerCase()) ||  // Search by assessment name
      assessment.finalDecision.toLowerCase().includes(this.searchQuery.toLowerCase()) ||  // Search by assessment reason
      new Date(assessment.assessmentDate).toISOString().includes(this.searchQuery) // Search by assessment date
    );
  }
  

  applySort(): void {
    if (this.selectedSort === 'assessmentDate') {
      this.filteredAssessments.sort((a, b) => {
        const dateA = new Date(a.assessmentDate).getTime();
        const dateB = new Date(b.assessmentDate).getTime();
        return this.sortDirection ? dateA - dateB : dateB - dateA;
      });
    } else if (this.selectedSort === 'id') {
      this.filteredAssessments.sort((a, b) => a.idAssessment.localeCompare(b.idAssessment));
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
