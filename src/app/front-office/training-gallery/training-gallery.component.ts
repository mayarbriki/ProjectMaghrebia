import { Component, OnInit } from '@angular/core';
import { TrainingService, Training } from '../../training.service';
import { QuizService, Quiz } from '../../quiz.service';
import { RatingService } from '../../rating.service';
import { EnrollmentService } from 'src/app/enrollement-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-training-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './training-gallery.component.html',
})
export class TrainingGalleryComponent implements OnInit {
  trainings: Training[] = [];
  selected: Training | null = null;
  quizzes: Quiz[] = [];
  isEnrolledMap: { [trainingId: number]: boolean } = {};
  ratingValues: { [trainingId: number]: number } = {};
  averageRatingMap: { [trainingId: number]: number } = {};

  quizSubmitted = false;
  showQuiz = false;

  constructor(
    private trainingService: TrainingService,
    private quizService: QuizService,
    private ratingService: RatingService,
    private enrollmentService: EnrollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getTrainings().subscribe({
      next: (data) => {
        this.trainings = data;

        this.trainings.forEach((training) => {
          if (training.trainingId != null) {
            this.loadAverageRating(training.trainingId);

            const userId = 1; // ⚠️ remplacer plus tard par l'ID réel du user connecté
            this.enrollmentService.isEnrolled(userId, training.trainingId).subscribe({
              next: (isEnrolled) => {
                this.isEnrolledMap[training.trainingId!] = isEnrolled;
              },
              error: () => {
                this.isEnrolledMap[training.trainingId!] = false;
              },
            });
          }
        });
      },
      error: (err) => console.error('Erreur chargement des formations:', err),
    });
  }

  rateTraining(trainingId: number, value: number) {
    this.ratingValues[trainingId] = value;
    this.ratingService.rateTraining(trainingId, value).subscribe(() => {
      this.loadAverageRating(trainingId);
    });
  }

  loadAverageRating(trainingId: number) {
    this.ratingService.getAverage(trainingId).subscribe((avg) => {
      this.averageRatingMap[trainingId] = avg;
    });
  }

  // ✅ Redirige vers le formulaire d'inscription
  redirectToEnrollment(training: Training): void {
    this.router.navigate(['/enrollment'], {
      queryParams: {
        formation: training.title,
        trainingId: training.trainingId
      }
    });
  }

  isOngoing(training: Training): boolean {
    const now = Date.now();
    const start = new Date(training.startDate).getTime();
    const end = new Date(training.endDate).getTime();
    return start <= now && now <= end;
  }

  isUpcoming(training: Training): boolean {
    const start = new Date(training.startDate).getTime();
    return start > Date.now();
  }

  isExpired(training: Training): boolean {
    const end = new Date(training.endDate).getTime();
    return end < Date.now();
  }
}
