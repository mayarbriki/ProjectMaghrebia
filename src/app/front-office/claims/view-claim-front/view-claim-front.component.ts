import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../claim.service';
import { Claim, StatusClaim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { ChatbotComponent } from 'src/app/chatbot/chatbot.component';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx'; // Importation de la bibliothèque XLSX
import {AuthService} from 'src/app/auth.service';
@Component({
  selector: 'app-view-claim-front',
  templateUrl: './view-claim-front.component.html',
  styleUrls: ['./view-claim-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent,ChatbotComponent]
})
export class ViewClaimComponentFront implements OnInit {
  claim: Claim = {
    idClaim: '',
    fullName: '',
    claimName: '',
    submissionDate: new Date(),
    statusClaim: StatusClaim.PENDING,
    claimReason: '',
    description: '',
    userId: 0,
    supportingDocuments: [],
    assessment: null
  };

  statusClaims = Object.values(StatusClaim);
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';
    claims: Claim[] = [];


  constructor(
    private claimService: ClaimService,
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    const user = this.authService.getUser();
  
    if (claimId && user) {
      const userId = user.id;
      const role = user.role;
  
      this.claimService.getClaimById(claimId, userId, role).subscribe(
        (data) => {
          this.claim = data;
          console.log('Claim data:', this.claim);
          console.log('Supporting documents:', this.claim.supportingDocuments);
        },
        (error) => {
          console.error('Error fetching claim details', error);
        }
      );
    } else {
      console.error('Claim ID or user is missing');
    }
  }
  
  isImage(url: string): boolean {
    // Vérifier si l'URL est définie et si elle correspond à une image (par extension)
    if (!url) return false; // Assurez-vous que l'URL existe
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  }
  
  
  editClaim(id: string): void {
    this.router.navigate([`/claimsFront/EditClaim/${id}`]);
  }

  deleteClaim(id: string): void {
    const user = this.authService.getUser();
  
    if (!id || !user) {
      console.error('Invalid claim ID or user');
      return;
    }
  
    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.deleteClaim(id, user.id, user.role).subscribe(
        () => {
          this.claims = this.claims.filter(claim => claim.idClaim !== id);
          this.router.navigate(['/claims']);
        },
        (error) => {
          console.error('Error deleting claim:', error);
        }
      );
    }
  }
  
  

  viewAssessment(idClaim: string): void {
    const user = this.authService.getUser();
  
    if (!user) {
      console.error('User not found');
      return;
    }
  
    this.claimService.getClaimById(idClaim, user.id, user.role).subscribe(
      (claim) => {
        if (claim && claim.assessment) {
          const idAssessment = claim.assessment.idAssessment;
          this.router.navigate([`/assessmentsFront/ViewAssessment/${idAssessment}`]);
        } else {
          alert('No assessment found for this claim.');
        }
      },
      (error) => {
        console.error('Error fetching claim:', error);
        if (error.status === 404) {
          alert('Claim not found.');
        } else {
          alert('Server error. Please try again later.');
        }
      }
    );
  }
  

  downloadPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    const logoImg = new Image();
    logoImg.src = 'assets/FrontOffice/img/maghrebia (2).png';
  
    logoImg.onload = () => {
      doc.addImage(logoImg, 'PNG', 20, 10, 50, 25);
  
      const title = 'Customer Claim Overview';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(50, 50, 255);
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 45);
  
      const boxX = 15;
      const boxY = 55;
      const boxWidth = pageWidth - 30;
      const boxHeight = 100;
      doc.setDrawColor(180);
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxWidth, boxHeight);
  
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      let y = boxY + 12;
      const lineHeight = 10;
  
      const drawField = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, boxX + 5, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, boxX + 60, y);
        y += lineHeight;
      };
  
      drawField('Full Name', this.claim.fullName || 'N/A');
      drawField('Claim Name', this.claim.claimName || 'N/A');
  
      const submissionDate = this.claim.submissionDate instanceof Date
        ? this.claim.submissionDate
        : new Date(this.claim.submissionDate);
      drawField('Submission Date', submissionDate.toLocaleDateString());
  
      drawField('Status', this.claim.statusClaim || 'N/A');
      drawField('Reason', this.claim.claimReason || 'N/A');
  
      doc.setFont('helvetica', 'bold');
      doc.text('Description:', boxX + 5, y);
      doc.setFont('helvetica', 'normal');
      const descLines: string[] = doc.splitTextToSize(this.claim.description || '', 100);
      y += 5;
      descLines.forEach(line => {
        doc.text(line, boxX + 60, y);
        y += lineHeight;
      });
  
      const thankYouY = boxY + boxHeight + 20;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      const line1 = 'Thank you for trusting Maghrebia Insurance.';
      const line2 = 'We remain at your disposal for any further information.';
      const line1Width = doc.getTextWidth(line1);
      const line2Width = doc.getTextWidth(line2);
      doc.text(line1, (pageWidth - line1Width) / 2, thankYouY);
      doc.text(line2, (pageWidth - line2Width) / 2, thankYouY + 10);
  
      const footerY = 270;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(
        `Maghrebia Insurance — 64, rue de Palestine, 1002 / 24, Rue du Royaume d'Arabie Saoudite, Tunis`,
        boxX,
        footerY
      );
      doc.text(`Phone: 00 216 71 788 800 | Fax: 00 216 71 788 334`, boxX, footerY + 5);
      doc.text(`Email: relation.client@maghrebia.com.tn`, boxX, footerY + 10);
  
      doc.save('Customer_Claim_Overview.pdf');
    };
  }
    
  downloadExcel(): void {
    const submissionDate = this.claim.submissionDate instanceof Date
      ? this.claim.submissionDate
      : new Date(this.claim.submissionDate);
  
    const claimData = [
      { label: 'Full Name', value: this.claim.fullName },
      { label: 'Claim Name', value: this.claim.claimName },
      { label: 'Submission Date', value: submissionDate.toLocaleDateString() },
      { label: 'Status', value: this.claim.statusClaim },
      { label: 'Reason', value: this.claim.claimReason },
      { label: 'Description', value: this.claim.description }
    ];
  
    const documents = this.claim.supportingDocuments.map((file, index) => ({
      label: `Supporting Document ${index + 1}`,
      value: file.url
    }));
  
    const finalData = [...claimData, ...documents];
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData.map(item => ({
      'Field': item.label,
      'Value': item.value
    })));
  
    const title = 'Claim Details Report';
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } } // Fusionner les cellules de la première ligne
    ];
    ws['A1'] = { v: title, t: 's' }; // Ajouter le titre dans la première cellule
    ws['A1'].s = { 
      font: { bold: true, sz: 18, color: { rgb: 'FFFFFF' } }, // Titre en gras, taille 18, texte blanc
      alignment: { horizontal: 'center', vertical: 'center' }, // Aligné au centre
      fill: { fgColor: { rgb: '4CAF50' } } // Fond vert
    };
  
    const headerStyle = { 
      font: { bold: true, sz: 12, color: { rgb: '000000' } }, // Textes des en-têtes en gras
      fill: { fgColor: { rgb: 'D3D3D3' } }, // Fond gris clair pour les en-têtes
      alignment: { horizontal: 'center' } // Aligné au centre
    };
  
    // Définir les en-têtes de la feuille Excel
    ws['A2'] = { v: 'Field', t: 's', s: headerStyle };
    ws['B2'] = { v: 'Value', t: 's', s: headerStyle };
  
    // Appliquer des styles aux lignes suivantes
    finalData.forEach((item, index) => {
      const rowIndex = index + 3; // Commencer à la ligne 3 (après le titre et les en-têtes)
      
      // Style pour les données de la réclamation
      const rowStyle = { 
        font: { sz: 10, color: { rgb: '000000' } }, // Taille de police 10 et texte noir
        alignment: { horizontal: 'left' } // Aligné à gauche
      };
  
      // Appliquer les valeurs de la réclamation aux cellules
      ws[`A${rowIndex}`] = { v: item.label, t: 's', s: rowStyle };
      ws[`B${rowIndex}`] = { v: item.value, t: 's', s: rowStyle };
    });
  
    // Créer un classeur Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Claim Details');
    
    // Télécharger le fichier Excel
    XLSX.writeFile(wb, 'claim-details.xlsx');
  }
  

  goBack() : void {
    this.router.navigate(['/claims']);
  }

}
