import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../../../../assessment.service';
import { Assessment, StatusAssessment, FinalDecision } from '../../../../models/assessment.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Claim } from '../../../../models/claim.model';
import { ClaimService } from 'src/app/claim.service';
import { AuthService, User } from 'src/app/auth.service'; 

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
  claims: Claim[] = [];
  currentUser: User | null = null;

  constructor(private assessmentService: AssessmentService, private router: Router,private claimService: ClaimService,private authService: AuthService) {}

  ngOnInit(): void {
    this.loadClaims(); // ✅ Récupérer les claims au démarrage
  }

  // ✅ Récupérer les claims depuis l'API
  private loadClaims(): void {
   /*// const userId = this.authService.getCurrentUserId(); // assure-toi que cette méthode existe
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
  
    this.claimService.getAllClaims(userId).subscribe(
      (data: Claim[]) => {
        this.claims = data;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des claims', error);
      }
    );*/
  }
  
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  
  onSubmit(): void {
    const formData = new FormData();
      // Convert string dates to Date objects before calling toISOString()
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
  formData.append("submissionDate", submissionDate.toISOString());    formData.append("claimId", this.assessment.claim.idClaim); // ✅ Ajouter l'ID du claim sélectionné

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
  goBack(): void {
    this.router.navigate(['/admin/assessments']);
  }
}
