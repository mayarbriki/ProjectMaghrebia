import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Assessment, StatusAssessment, FinalDecision } from '../../../../models/assessment.model';
import { AssessmentService } from '../../../../assessment.service';
import { CommonModule } from '@angular/common';
import {AuthService,User} from "../../../../auth.service";
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-list-assessment',
  templateUrl: './list-assessment.component.html',
  styleUrls: ['./list-assessment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule,NgxChartsModule]
})
export class ListAssessmentComponent implements OnInit {
  assessments: Assessment[] = [];
  filteredAssessments: Assessment[] = [];
  searchQuery: string = '';
  selectedSort: string = 'assessmentDate'; // Default sorting by date
  sortDirection: boolean = true; // true for ascending, false for descending
  page: number = 1; // Variable pour la page actuelle
  pageSize: number = 6; // Nombre d'éléments par page
  currentUser: User | null = null;
  
  statusChartData: any[] = [];
  decisionChartData: any[] = [];
  dailyChartData: any[] = [];
  previousTotalAssessments: number = 0;
  totalAssessments: number = 0;

  colorScheme: Color = {
    name: 'custom1',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  colorScheme2: Color = {
    name: 'custom2',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3366CC', '#DC3912', '#FF9900']
  };
  
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
        this.calculateStats();
      // Vérifie si le total des assessments a changé
      if (this.totalAssessments !== this.previousTotalAssessments) {
        this.previousTotalAssessments = this.totalAssessments;
        // Animation de mise à jour ici (ajout d'une logique dans l'HTML et CSS)
      }

      this.totalAssessments = this.assessments.length;      
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
    this.calculateStats();
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
    if (!id) {
        console.error('Invalid assessment ID');
        return;
    }

    const user = this.authService.getUser(); 
    if (!user) {
        console.error('User not authenticated');
        return;
    }

    const userId = user.id;  // Récupérer l'ID de l'utilisateur connecté
    const role = user.role;   // Récupérer le rôle de l'utilisateur (par exemple, admin ou utilisateur classique)

    if (confirm('Are you sure you want to delete this assessment?')) {
        // Convertir l'ID en string si nécessaire
        const assessmentId = String(id);  // Convertir en string ici si `id` est un number

        this.assessmentService.deleteAssessment(assessmentId, userId, role).subscribe(
            () => {
                // Si la suppression est réussie, vous pouvez également supprimer l'évaluation du tableau local
                this.assessments = this.assessments.filter(assessment => String(assessment.idAssessment) !== assessmentId); // Assurez-vous de comparer les types correctement
                // Rafraîchissez la vue ou appliquez une logique de recherche après la suppression
                this.applySearch();
            },
            (error) => {
                console.error('Error deleting assessment:', error);
            }
        );
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
        this.calculateStats();
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
        this.calculateStats();
      }
    );
  }
  
  calculateStats(): void {
    this.totalAssessments = this.filteredAssessments.length;
  
    // Pour le pie chart des statuts
    const statusMap: { [key: string]: number } = {};
    const decisionMap: { [key: string]: number } = {};
    const dateMap: { [key: string]: number } = {};
  
    for (const assessment of this.filteredAssessments) {
      statusMap[assessment.statusAssessment] = (statusMap[assessment.statusAssessment] || 0) + 1;
      decisionMap[assessment.finalDecision] = (decisionMap[assessment.finalDecision] || 0) + 1;
      const date = new Date(assessment.assessmentDate).toISOString().split('T')[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    }
  
    this.statusChartData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));
    this.decisionChartData = Object.entries(decisionMap).map(([name, value]) => ({ name, value }));
    this.dailyChartData = Object.entries(dateMap).map(([name, value]) => ({ name, value }));
  }
}
