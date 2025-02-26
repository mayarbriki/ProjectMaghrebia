import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../../../../assessment.service';
import { Assessment, StatusAssessment, FinalDecision } from '../../../../models/assessment.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Claim } from '../../../../models/claim.model';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddAssessmentComponent implements OnInit {
  assessment: Assessment = {
    idAssessment: '',
    assessmentDate: new Date(),
    findings: '',
    assessmentDocuments: [],
    statusAssessment: StatusAssessment.PENDING,
    finalDecision: FinalDecision.APPROVED,
    submissionDate: new Date(),
    claim: {} as Claim 
  };

  statusOptions = Object.values(StatusAssessment);
  decisionOptions = Object.values(FinalDecision);
  selectedFiles: File[] = [];

  constructor(private assessmentService: AssessmentService, private router: Router) {}

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append("assessmentDate", this.assessment.assessmentDate.toISOString());
    formData.append("findings", this.assessment.findings);
    formData.append("statusAssessment", this.assessment.statusAssessment);
    formData.append("finalDecision", this.assessment.finalDecision);
    formData.append("submissionDate", this.assessment.submissionDate.toISOString());

    this.selectedFiles.forEach((file) => {
      formData.append("assessmentDocuments", file);
    });

    this.assessmentService.createAssessment(formData).subscribe(
      response => {
        console.log('Assessment created successfully', response);
        alert('Assessment added successfully!');
        this.router.navigate(['/admin/assessments']);
      },
      error => {
        console.error('Error creating assessment', error);
        alert('Failed to create assessment.');
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/admin/assessments']);
  }
}
