import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
}
export interface Training {
  trainingId?: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  mode: 'PRESENTIEL' | 'EN_LIGNE' | 'HYBRIDE';
  createdAt?: string;
  imageUrl?: string; 
  coursePdfUrl?: string;
  quizzes?: Quiz[]; 

}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private apiUrl = 'http://localhost:6969/trainings';
  private fileApi = 'http://localhost:6969/files'; // ✅ Endpoint pour fichiers

  constructor(private http: HttpClient) {}

  // ✅ Get all trainings
  getTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  // ✅ Get training by ID
  getTrainingById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create new training
  createTraining(training: Training): Observable<Training> {
    training = this.prepareTraining(training);
    return this.http.post<Training>(this.apiUrl, training);
  }

  // ✅ Update training
  updateTraining(id: number, training: Training): Observable<Training> {
    training = this.prepareTraining(training);
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training);
  }

  // ✅ Delete training
  deleteTraining(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // ✅ Upload image file for a training
  uploadTrainingImage(trainingId: number, file: File): Observable<Training> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Training>(`${this.fileApi}/uploadTrainingImage/${trainingId}`, formData);
  }

  uploadTrainingPdf(trainingId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/uploadPdf/${trainingId}`, formData);
  }
  

  // 🔧 Prepare training before saving
  private prepareTraining(training: Training): Training {
    training.title = training.title.trim();
    training.description = training.description.trim();
    return training;
  }
  
}
