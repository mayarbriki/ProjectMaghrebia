import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../../../assessment.service';
import { Assessment, StatusAssessment, FinalDecision } from '../../../models/assessment.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { ChatbotComponent } from 'src/app/chatbot/chatbot.component';
import { Router } from '@angular/router';
import { Claim } from '../../../models/claim.model';
import { ClaimService } from 'src/app/claim.service';
import { AuthService, User } from 'src/app/auth.service';

@Component({
  selector: 'app-add-assessment-front',
  standalone: true,
  templateUrl: './add-assessment-front.component.html',
  styleUrls: ['./add-assessment-front.component.scss'],
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent,ChatbotComponent]
})
export class AddAssessmentFrontComponent implements OnInit {
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
  claims: Claim[] = [];
  currentUser: User | null = null;

  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private claimService: ClaimService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  private loadClaims(): void {
    const user = this.authService.getUser();
    if (user) {
      const role = user.role;

      // ✅ ADMIN et AGENT peuvent voir tous les claims
      if (role === 'ADMIN' || role === 'AGENT') {
        this.claimService.getAllClaims().subscribe(
          (data: Claim[]) => {
            this.claims = data;
          },
          (error: any) => {
            console.error('Error fetching claims', error);
          }
        );
      } else {
        // Les autres rôles n’ont pas accès à cette page, normalement
        console.warn('Access not allowed for role:', role);
        this.router.navigate(['/claims']); 
      }
    } else {
      console.error('User not connected');
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    const assessmentDate = this.assessment.assessmentDate instanceof Date
      ? this.assessment.assessmentDate
      : new Date(this.assessment.assessmentDate);

    const submissionDate = this.assessment.submissionDate instanceof Date
      ? this.assessment.submissionDate
      : new Date(this.assessment.submissionDate);

    formData.append("assessmentDate", assessmentDate.toISOString());
    formData.append("findings", this.assessment.findings);
    formData.append("statusAssessment", this.assessment.statusAssessment);
    formData.append("finalDecision", this.assessment.finalDecision);
    formData.append("submissionDate", submissionDate.toISOString());
    formData.append("claimId", this.assessment.claim.idClaim);

    this.selectedFiles.forEach((file) => {
      formData.append("assessmentDocuments", file);
    });

    this.assessmentService.createAssessment(formData).subscribe(
      response => {
        console.log('Assessment created successfully', response);
        alert('Assessment added successfully!');
        this.router.navigate(['/assessments']);
      },
      error => {
        console.error('Error creating assessment', error);
        alert('Failed to create assessment.');
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/assessments']);
  }

  goBack(): void {
    this.router.navigate(['/assessments']);
  }
}
