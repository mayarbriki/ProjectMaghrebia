import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Quiz {
  id?: number;
  question: string;
  options: string[];
  correctAnswer: string;
  training_id?: number;
  userAnswer?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:6969/quizzes';

  constructor(private http: HttpClient) {}

  getQuizzesByTraining(trainingId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/training/${trainingId}`);
  }

  addQuizToTraining(trainingId: number, quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/training/${trainingId}`, quiz);
  }
}
