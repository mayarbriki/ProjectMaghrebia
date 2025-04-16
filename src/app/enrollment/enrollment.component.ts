import { Component, OnInit } from '@angular/core';
import { EnrollmentService, Enrollment } from 'src/app/enrollement-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class EnrollmentComponent implements OnInit {
  enrollment: Enrollment = {
    nom: '',
    prenom: '',
    cin: '',
    formation: '',
    trainingId: 0,
    userId: 0, // ✅ INIT par défaut
    dateInscription: new Date().toISOString().substring(0, 10),
  };

  successMessage = '';
  errorMessage = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ Récupère les paramètres passés dans l’URL
    this.route.queryParams.subscribe(params => {
      this.enrollment.formation = params['formation'] || '';
      this.enrollment.trainingId = +params['trainingId'] || 0;
      this.enrollment.userId = 1; // ⚠️ à remplacer plus tard par l’utilisateur connecté
    });
  }

  onSubmit() {
    this.enrollmentService.inscrire(this.enrollment).subscribe({
      next: () => {
        this.successMessage = '✅ Inscription validée avec succès !';
        this.errorMessage = '';

        // ✅ Sauvegarde temporairement pour feedback
        localStorage.setItem('lastEnrollment', JSON.stringify({
          trainingId: this.enrollment.trainingId,
          formation: this.enrollment.formation,
        }));

        // Redirection vers galerie
        setTimeout(() => {
          this.router.navigate(['/training-gallery']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = '❌ Erreur lors de l’inscription.';
        this.successMessage = '';
      }
    });
  }
}
