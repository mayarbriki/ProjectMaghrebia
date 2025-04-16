import { Component, OnInit } from '@angular/core';
import { TrainingService, Training } from '../../training.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HeaderFrontComponent],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent implements OnInit {
  trainings: Training[] = [];

  form: Training = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    mode: 'PRESENTIEL',
    quizzes: []
  };

  addQuiz() {
    this.form.quizzes?.push({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  }

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedPdf: File | null = null;
  editMode: boolean = false;
  currentId?: number;

  constructor(
    private trainingService: TrainingService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings() {
    this.trainingService.getTrainings().subscribe(data => {
      this.trainings = data;
    });
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];

    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onPdfSelected(event: any) {
    this.selectedPdf = event.target.files[0];
  }

  // ✅ Submit form (updated with quiz submission)
  onSubmit() {
    if (this.editMode) {
      this.trainingService.updateTraining(this.currentId!, this.form).subscribe((res) => {
        if (res.trainingId !== undefined) {
          this.uploadImageIfNeeded(res.trainingId);
          this.uploadPdfIfNeeded(res.trainingId);
        }
        this.loadTrainings();
        this.cancelEdit();
      });
    } else {
      this.trainingService.createTraining(this.form).subscribe((res) => {
        if (res.trainingId !== undefined) {
          this.uploadImageIfNeeded(res.trainingId);
          this.uploadPdfIfNeeded(res.trainingId);

          // ✅ Send quizzes if available
          if (this.form.quizzes && this.form.quizzes.length > 0) {
            this.form.quizzes.forEach(quiz => {
              this.http.post(`http://localhost:6969/quizzes/training/${res.trainingId}`, quiz)
                .subscribe(() => {
                  console.log("✅ Quiz enregistré");
                }, err => {
                  console.error("❌ Erreur quiz:", err);
                });
            });
          }
        }

        this.loadTrainings();
        this.resetForm();
      });
    }
  }

  uploadPdfIfNeeded(trainingId: number) {
    if (this.selectedPdf) {
      const formData = new FormData();
      formData.append('file', this.selectedPdf);

      this.http.post(`http://localhost:6969/trainings/uploadPdf/${trainingId}`, formData)
        .subscribe(() => {
          this.loadTrainings();
          this.selectedPdf = null;
        });
    }
  }

  uploadImageIfNeeded(trainingId: number) {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('file', this.selectedImage);

      this.http.post(`http://localhost:6969/trainings/uploadTrainingImage/${trainingId}`, formData)
        .subscribe(() => {
          this.loadTrainings();
          this.selectedImage = null;
          this.imagePreview = null;
        });
    }
  }

  editTraining(t: Training) {
    this.form = { ...t };
    this.currentId = t.trainingId;
    this.editMode = true;
    this.imagePreview = t.imageUrl ? `http://localhost:6969${t.imageUrl}` : null;
  }

  deleteTraining(id?: number) {
    if (id && confirm("Tu veux vraiment supprimer cette formation ?")) {
      this.trainingService.deleteTraining(id).subscribe(() => this.loadTrainings());
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.resetForm();
  }

  resetForm() {
    this.form = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      mode: 'PRESENTIEL',
      quizzes: []
    };
    this.selectedImage = null;
    this.selectedPdf = null;
    this.imagePreview = null;
    this.currentId = undefined;
  }
}
