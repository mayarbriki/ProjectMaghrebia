import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../assessment.service'; // Import Assessment service
import { Assessment, StatusAssessment, FinalDecision } from '../../../models/assessment.model'; // Import relevant models
import { Claim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';

@Component({
  selector: 'app-view-assessment-front',
  templateUrl: './view-assessment-front.component.html',
  styleUrls: ['./view-assessment-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderFrontComponent,FooterFrontComponent]
})
export class ViewAssessmentComponentFront implements OnInit {
  assessment: Assessment = {
    idAssessment: '',
    assessmentDate: new Date(),
    findings: '',
    assessmentDocuments: [],
    statusAssessment: StatusAssessment.PENDING,
    finalDecision: FinalDecision.REJECTED,
    submissionDate: new Date(),
    claim: {} as Claim 
  };

  statusAssessments = Object.values(StatusAssessment);
  finalDecisions = Object.values(FinalDecision);

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('id');
    if (assessmentId) {
      this.assessmentService.getAssessmentById(assessmentId).subscribe(
        (data) => {
          this.assessment = data;
        },
        (error) => {
          console.error('Error fetching assessment details', error);
        }
      );
    }
  }

  editAssessment(): void {
    this.router.navigate([`/admin/assessments/EditAssessment/${this.assessment.idAssessment}`]);
  }

  deleteAssessment(): void {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.assessmentService.deleteAssessment(this.assessment.idAssessment).subscribe(
        () => {
          this.router.navigate(['/admin/assessments']);
        },
        (error) => {
          console.error('Error deleting assessment:', error);
        }
      );
    }
  }
}
