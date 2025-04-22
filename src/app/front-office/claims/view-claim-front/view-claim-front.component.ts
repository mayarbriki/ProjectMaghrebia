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
  
    // Ajouter un cadre autour de la page
    doc.setDrawColor(0); // Couleur du cadre (noir)
    doc.setLineWidth(1); // Épaisseur du cadre
    doc.rect(10, 10, 190, 277); // Crée un rectangle de 10x10 à 190x277 pour la page
  
    // Titre principal du PDF (centré avec couleur et taille de police)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(50, 50, 255); // Couleur bleue pour le titre
    doc.text('Claim Details', 105, 20, { align: 'center' });
  
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Couleur noire pour le texte suivant
  
    // Informations sur la réclamation
    doc.setFont('helvetica', 'bold');
    doc.text(`Full Name:`, 20, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(this.claim.fullName, 80, 40);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Claim Name:`, 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(this.claim.claimName, 80, 50);
  
    // Formater la date de soumission pour s'assurer qu'elle est bien une Date
    const submissionDate = this.claim.submissionDate instanceof Date
      ? this.claim.submissionDate
      : new Date(this.claim.submissionDate);
    doc.setFont('helvetica', 'bold');
    doc.text(`Submission Date:`, 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(submissionDate.toLocaleDateString(), 80, 60);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Status:`, 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(this.claim.statusClaim, 80, 70);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Reason:`, 20, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(this.claim.claimReason, 80, 80);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Description:`, 20, 90);
    doc.setFont('helvetica', 'normal');
  
    // Pour gérer le texte long et éviter qu'il sorte du cadre
    const descriptionText = this.claim.description || ''; 
    const maxWidth = 100; // Largeur maximale du texte
    const lines: string[] = doc.splitTextToSize(descriptionText, maxWidth); // Découpe le texte en lignes
  
    // Affiche les lignes découpées à partir de la position (80, 90)
    let yPosition = 90;
    lines.forEach((line: string) => { // Spécification du type 'string' pour 'line'
      doc.text(line, 80, yPosition);
      yPosition += 10; // Espace entre les lignes
    });
  
    // Documents de soutien
    let yPos = yPosition + 10; // On commence à une nouvelle position après la description
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Supporting Documents:', 20, yPos);
    yPos += 10;
  
    this.claim.supportingDocuments.forEach((file, index) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}. ${file.url}`, 20, yPos);
      yPos += 10;
    });
  
    // Séparer les sections par des lignes
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 5, 190, yPos + 5);
  
    // Footer avec du texte en petit et aligné au centre
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by MyPiProject', 105, yPos + 15, { align: 'center' });
  
    // Sauvegarde le fichier PDF
    doc.save('claim-details.pdf');
  }
    
  downloadExcel(): void {
    // Formater la date de soumission pour s'assurer qu'elle est bien une Date
    const submissionDate = this.claim.submissionDate instanceof Date
      ? this.claim.submissionDate
      : new Date(this.claim.submissionDate);
  
    // Créer un tableau d'objets avec les informations de la réclamation
    const claimData = [
      { label: 'Full Name', value: this.claim.fullName },
      { label: 'Claim Name', value: this.claim.claimName },
      { label: 'Submission Date', value: submissionDate.toLocaleDateString() },
      { label: 'Status', value: this.claim.statusClaim },
      { label: 'Reason', value: this.claim.claimReason },
      { label: 'Description', value: this.claim.description }
    ];
  
    // Ajouter une section pour les documents de soutien
    const documents = this.claim.supportingDocuments.map((file, index) => ({
      label: `Supporting Document ${index + 1}`,
      value: file.url
    }));
  
    // Combiner les données dans un seul tableau
    const finalData = [...claimData, ...documents];
  
    // Créer une feuille Excel à partir des données
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData.map(item => ({
      'Field': item.label,
      'Value': item.value
    })));
  
    // Ajouter un titre à la feuille Excel
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
  
    // Appliquer des styles aux autres cellules (ex: fond coloré pour les en-têtes)
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
