import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../assessment.service';
import { Assessment, StatusAssessment, FinalDecision } from '../../../models/assessment.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatusClaim } from '../../../models/claim.model';
import { Claim } from 'src/app/models/claim.model';
import { ClaimService } from 'src/app/claim.service';import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { ChatbotComponent } from 'src/app/chatbot/chatbot.component';
import { AuthService, User } from 'src/app/auth.service';
@Component({
  selector: 'app-modify-assessment-front',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent,ChatbotComponent],
  templateUrl: './modify-assessment-front.component.html',
  styleUrl: './modify-assessment-front.component.scss'
})
export class ModifyAssessmentFrontComponent implements OnInit {
  assessment: Assessment = {
    idAssessment: '',
    assessmentDate: new Date(),
    findings: '',
    assessmentDocuments: [],
    statusAssessment: StatusAssessment.PENDING,
    finalDecision: FinalDecision.IN_REVIEW,
    submissionDate: new Date(),
    claim: {} as Claim 
  };

  statusAssessments = Object.values(StatusAssessment);
  finalDecisions = Object.values(FinalDecision);
  selectedFiles: File[] = [];
  claims: Claim[] = [];
  currentUserRole: string = '';
  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch the current user's role
    const user = this.authService.getUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'AGENT')) {
      // Redirect if the user is not an ADMIN or AGENT
      alert('You do not have permission to edit assessments.');
      this.router.navigate(['/assessments']); // Redirect to assessments list or another page
      return;
    }

    this.currentUserRole = user.role; // Store the role for later use

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
      this.router.navigate(['/assessments']);
    }, error => {
      console.error("Error updating assessment:", error);
      alert('Failed to update assessment.');
    });
  }

  onCancel(): void {
    this.router.navigate(['/assessments']);    
  }
  goBack(): void {
    this.router.navigate(['/assessments'], { relativeTo: this.route });
  }
}

