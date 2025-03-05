import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../claim.service';
import { Claim, StatusClaim } from '../../../models/claim.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from 'src/app/front-office/header-front/header-front.component';
import { FooterFrontComponent } from 'src/app/front-office/footer-front/footer-front.component';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-view-claim-front',
  templateUrl: './view-claim-front.component.html',
  styleUrls: ['./view-claim-front.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent]
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
    supportingDocuments: [],
    assessment: null
  };

  statusClaims = Object.values(StatusClaim);
  selectedFiles: File[] = [];
  temporaryOtherClaimReason: string = '';

  constructor(
    private claimService: ClaimService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    if (claimId) {
      this.claimService.getClaimById(claimId).subscribe(
        (data) => {
          this.claim = data;
        },
        (error) => {
          console.error('Error fetching claim details', error);
        }
      );
    }
  }

  editClaim(): void {
    this.router.navigate([`/admin/claims/EditClaim/${this.claim.idClaim}`]);
  }

  deleteClaim(): void {
    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.deleteClaim(this.claim.idClaim).subscribe(
        () => {
          this.router.navigate(['/admin/claims']);
        },
        (error) => {
          console.error('Error deleting claim:', error);
        }
      );
    }
  }

  viewAssessment(idClaim: string): void {
    this.claimService.getClaimById(idClaim).subscribe(
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

  // New method to download the claim details as PDF
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
    
  
  
}
