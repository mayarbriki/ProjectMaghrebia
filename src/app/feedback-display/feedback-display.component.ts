import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FeedbackService } from '../feedback.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importer ReactiveFormsModule et outils
import { HeaderFrontComponent } from '../front-office/header-front/header-front.component';

@Component({
  selector: 'app-feedback-display',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent], // Remplacer FormsModule par ReactiveFormsModule
  templateUrl: './feedback-display.component.html',
  styleUrls: ['./feedback-display.component.scss']
})
export class FeedbackDisplayComponent implements OnInit {
  feedbacks: any[] = [];
  userId: number | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  imageErrors: { [key: number]: boolean } = {};
  editMode: { [key: number]: boolean } = {};
  editForms: { [key: number]: FormGroup } = {}; // Stocker les formulaires pour chaque feedback
  private apiUrl = 'http://localhost:8083/feedback';
  private staticBaseUrl = 'http://localhost:8083/feedback/uploads/';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private feedbackService: FeedbackService,
    private fb: FormBuilder // Injecter FormBuilder
  ) {}

  ngOnInit() {
    this.loading = true;
    this.authService.user$.subscribe(user => {
      this.userId = user?.id || null;
      console.log('FeedbackDisplayComponent - User ID from AuthService:', this.userId);
      if (this.userId) {
        this.loadUserFeedbacks();
      } else {
        this.loading = false;
        this.errorMessage = 'Please log in to view your feedback';
      }
    });
  }

  loadUserFeedbacks() {
    if (this.userId) {
      this.http.get<any[]>(`${this.apiUrl}/user/${this.userId}`).subscribe({
        next: (feedbacks) => {
          console.log('FeedbackDisplayComponent - Received feedback data:', feedbacks);
          this.feedbacks = feedbacks.map(feedback => {
            const filename = feedback.imageUrl || feedback.image_url || '';
            return {
              ...feedback,
              fullImageUrl: filename ? `${this.staticBaseUrl}${filename}` : ''
            };
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('FeedbackDisplayComponent - Error loading feedbacks:', error);
          this.errorMessage = 'Failed to load feedbacks: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  // Initialiser le formulaire pour un feedback en mode édition
  editFeedback(index: number) {
    const feedback = this.feedbacks[index];
    this.editMode[index] = true;
    this.editForms[index] = this.fb.group({
      content: [feedback.content, [Validators.required, Validators.minLength(3)]], // Contenu requis, min 3 caractères
      rating: [feedback.rating, [Validators.required, Validators.min(1), Validators.max(5)]], // Rating requis, entre 1 et 5
      imageFile: [null] // Image optionnelle
    });
  }

  // Annuler l'édition
  cancelEdit(index: number) {
    this.editMode[index] = false;
    delete this.editForms[index];
  }

  // Sauvegarder le feedback modifié
  saveFeedback(index: number) {
    const feedback = this.feedbacks[index];
    const form = this.editForms[index];

    if (form.invalid) {
      console.log('Formulaire invalide:', form.errors);
      return; // Ne pas sauvegarder si le formulaire est invalide
    }

    const { content, rating, imageFile } = form.value;

    this.feedbackService.updateFeedback(feedback.id, content, rating, imageFile).subscribe({
      next: (updatedFeedback) => {
        console.log('FeedbackDisplayComponent - Feedback updated:', updatedFeedback);
        this.feedbacks[index] = {
          ...updatedFeedback,
          fullImageUrl: updatedFeedback.imageUrl ? `${this.staticBaseUrl}${updatedFeedback.imageUrl}` : ''
        };
        this.editMode[index] = false;
        delete this.editForms[index];
      },
      error: (error) => {
        console.error('FeedbackDisplayComponent - Error updating feedback:', error);
        this.errorMessage = 'Failed to update feedback: ' + error.message;
      }
    });
  }

  deleteFeedback(id: number, index: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.deleteFeedback(id).subscribe({
        next: () => {
          console.log('FeedbackDisplayComponent - Feedback deleted:', id);
          this.feedbacks.splice(index, 1);
        },
        error: (error) => {
          console.error('FeedbackDisplayComponent - Error deleting feedback:', error);
          this.errorMessage = 'Failed to delete feedback: ' + error.message;
        }
      });
    }
  }

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.editForms[index].patchValue({ imageFile: input.files[0] });
    }
  }

  onImageError(index: number) {
    console.error('FeedbackDisplayComponent - Image failed to load for index:', index);
    this.imageErrors[index] = true;
  }

  getImageUrl(filename: string): string {
    if (!filename) return '';
    return `${this.staticBaseUrl}${filename}`;
  }
}