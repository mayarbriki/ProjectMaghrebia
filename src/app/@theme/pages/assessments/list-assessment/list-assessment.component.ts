import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Assessment } from '../../../../models/assessment.model';
import { AssessmentService } from '../../../../assessment.service';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAssessments();
  }

  fetchAssessments(): void {
    this.assessmentService.getAllAssessments().subscribe(
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
}
