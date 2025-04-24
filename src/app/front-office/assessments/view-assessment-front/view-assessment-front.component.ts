import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../assessment.service'; // Import Assessment service
import { Assessment, StatusAssessment, FinalDecision } from '../../../models/assessment.model'; // Import relevant models
import { Claim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { ChatbotComponent } from 'src/app/chatbot/chatbot.component';
import { AuthService, User } from 'src/app/auth.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-view-assessment-front',
  templateUrl: './view-assessment-front.component.html',
  styleUrls: ['./view-assessment-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderFrontComponent,FooterFrontComponent,ChatbotComponent]
})
export class ViewAssessmentComponentFront implements OnInit {
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
  userRole: string = '';
  currentUser: User | null = null;

  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userRole = user.role;
        this.currentUser = user;
      }
    });

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


  deleteAssessment(): void {
    // Vérifiez si l'utilisateur est authentifié et récupérez ses informations
    if (!this.currentUser) {
      console.error('User not authenticated');
      return;
    }

    const userId = this.currentUser.id;  // ID de l'utilisateur
    const role = this.currentUser.role;   // Rôle de l'utilisateur

    if (confirm('Are you sure you want to delete this assessment?')) {
      // Convertissez l'ID de l'évaluation en string
      const assessmentId = String(this.assessment.idAssessment);

      // Appelez le service de suppression avec l'ID de l'évaluation, l'ID de l'utilisateur et son rôle
      this.assessmentService.deleteAssessment(assessmentId, userId, role).subscribe(
        () => {
          // Une fois la suppression réussie, naviguez vers la liste des évaluations
          this.router.navigate(['/assessments']);
        },
        (error) => {
          console.error('Error deleting assessment:', error);
        }
      );
    }
  }

  goBack() : void {
    this.router.navigate(['/assessments']);
  }

  navigateToEditAssessment(): void {
    this.router.navigate([`/assessmentsFront/EditAssessment/${this.assessment.idAssessment}`]);
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    const logoImg = new Image();
    logoImg.src = 'assets/FrontOffice/img/maghrebia (2).png';
  
    logoImg.onload = () => {
      doc.addImage(logoImg, 'PNG', 20, 10, 50, 25);
  
      const title = 'Final Assessment Document';
      doc.setTextColor(0, 102, 204);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 45);
  
      const boxX = 15;
      const boxY = 55;
      const boxWidth = pageWidth - 30;
      const boxHeight = 90;
      doc.setDrawColor(180);
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxWidth, boxHeight);
  
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      let y = boxY + 12;
      const lineHeight = 10;
  
      const drawLabelValue = (label: string, value: string | Date) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, boxX + 5, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${value}`, boxX + 60, y);
        y += lineHeight;
      };
  
      drawLabelValue('Claim Name', this.assessment.claim?.claimName || 'N/A');
      drawLabelValue('Assessment Date', new Date(this.assessment.assessmentDate).toLocaleDateString());
      drawLabelValue('Findings', this.assessment.findings || 'N/A');
      drawLabelValue('Status', this.assessment.statusAssessment);
      drawLabelValue('Final Decision', this.assessment.finalDecision);
      drawLabelValue('Submission Date', new Date(this.assessment.submissionDate).toLocaleDateString());
  
      const thankYouY = boxY + boxHeight + 20;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      const line1 = 'Thank you for trusting Maghrebia Insurance.';
      const line2 = 'We remain at your disposal for any further information.';
      const line1Width = doc.getTextWidth(line1);
      const line2Width = doc.getTextWidth(line2);
      doc.text(line1, (pageWidth - line1Width) / 2, thankYouY);
      doc.text(line2, (pageWidth - line2Width) / 2, thankYouY + 10);
  
      const contactY = 270;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(
        'Maghrebia Insurance — 64, rue de Palestine, 1002 / 24, Rue du Royaume d\'Arabie Saoudite, Tunis',
        boxX,
        contactY
      );
      doc.text('Phone: 00 216 71 788 800 | Fax: 00 216 71 788 334', boxX, contactY + 5);
      doc.text('Email: relation.client@maghrebia.com.tn', boxX, contactY + 10);
  
      const fileName = `assessment_${this.assessment.claim?.fullName || 'document'}.pdf`;
      doc.save(fileName);
    };
  }

}
