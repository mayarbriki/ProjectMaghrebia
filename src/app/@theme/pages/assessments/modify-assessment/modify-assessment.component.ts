import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../../assessment.service';
import { Assessment, StatusAssessment, FinalDecision } from '../../../../models/assessment.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatusClaim } from '../../../../models/claim.model';

@Component({
  selector: 'app-modify-assessment',
  templateUrl: './modify-assessment.component.html',
  styleUrls: ['./modify-assessment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ModifyAssessmentComponent implements OnInit {
  assessment: Assessment = {
    idAssessment: '',
    assessmentDate: new Date(),
    findings: '',
    assessmentDocuments: [],
    statusAssessment: StatusAssessment.PENDING,
    finalDecision: FinalDecision.REJECTED,
    submissionDate: new Date(),
    claim: { idClaim: '', fullName: '', claimName: '', submissionDate: new Date(), statusClaim: StatusClaim.PENDING, claimReason: '', description: '', supportingDocuments: [], assessment: null }
  };

  statusAssessments = Object.values(StatusAssessment);
  finalDecisions = Object.values(FinalDecision);
  selectedFiles: File[] = [];

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('id');
    if (assessmentId) {
      this.assessmentService.getAssessmentById(assessmentId).subscribe((data) => {
        this.assessment = data;
        // Ensure that dates are in the correct format
        if (this.assessment.assessmentDate && typeof this.assessment.assessmentDate === 'string') {
          this.assessment.assessmentDate = new Date(this.assessment.assessmentDate);
        }
        if (this.assessment.submissionDate && typeof this.assessment.submissionDate === 'string') {
          this.assessment.submissionDate = new Date(this.assessment.submissionDate);
        }
      }, error => {
        console.error("Error fetching assessment:", error);
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onUpdate(): void {
    const formData = new FormData();

    // Ensure assessment dates are in the correct format
    formData.append("assessmentDate", new Date(this.assessment.assessmentDate).toISOString());
    formData.append("findings", this.assessment.findings);
    formData.append("statusAssessment", this.assessment.statusAssessment);
    formData.append("finalDecision", this.assessment.finalDecision);
    formData.append("submissionDate", new Date(this.assessment.submissionDate).toISOString());

    // Add documents
    this.selectedFiles.forEach((file) => {
      formData.append("assessmentDocuments", file);
    });

    // Update the assessment through the service
    this.assessmentService.updateAssessment(this.assessment.idAssessment, formData).subscribe(() => {
      alert('Assessment updated successfully!');
      this.router.navigate(['/admin/assessments']);
    }, error => {
      console.error("Error updating assessment:", error);
      alert('Failed to update assessment.');
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/assessments']);    
  }
}
