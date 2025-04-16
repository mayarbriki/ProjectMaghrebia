import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService, Quiz } from '../../quiz.service';
import { CertificateService } from '../../certificate.service'; // ⭐ Import service certif
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-quiz',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  trainingId!: number;
  quizzes: Quiz[] = [];
  quizSubmitted = false;
  isQuizPassed = false;

  userId: number = 1; // ⚠️ À remplacer dynamiquement si tu as un système d'authentification

  mode: 'ajout' | 'faire' = 'faire';

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private certificateService: CertificateService // ⭐ Injecté
  ) {}

  ngOnInit(): void {
    this.trainingId = +this.route.snapshot.paramMap.get('id')!;
    this.mode = this.route.snapshot.queryParamMap.get('mode') === 'ajout' ? 'ajout' : 'faire';

    if (this.trainingId) {
      this.quizService.getQuizzesByTraining(this.trainingId).subscribe(data => {
        this.quizzes = data.map(q => ({
          ...q,
          userAnswer: ''
        }));
      });
    }
  }

  submitQuiz() {
    this.quizSubmitted = true;
    this.isQuizPassed = this.quizzes.every(q => q.userAnswer === q.correctAnswer);
  }

  downloadCertificate(): void {
    this.certificateService.generate(this.trainingId, this.userId).subscribe({
      next: (path: string) => {
        const url = 'http://localhost:8080' + path;
        window.open(url, '_blank');
      },
      error: (err) => {
        alert('❌ Erreur lors de la génération du certificat.');
        console.error(err);
      }
    });
  }
}
