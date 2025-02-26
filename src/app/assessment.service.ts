import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from './models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private baseUrl = 'http://localhost:8089/assessments';

  constructor(private http: HttpClient) { }

  // Create Assessment
  createAssessment(assessment: FormData): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/create`, assessment);
  }

  // Get Assessment by ID
  getAssessmentById(id: string): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.baseUrl}/get/${id}`);
  }

  // Get all Assessments
  getAllAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/all`);
  }

  // Update Assessment
  updateAssessment(id: string, assessment: FormData | Assessment): Observable<Assessment> {
    if (assessment instanceof FormData) {
      return this.http.put<Assessment>(`${this.baseUrl}/update/${id}`, assessment);
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.put<Assessment>(`${this.baseUrl}/update/${id}`, assessment, { headers });
    }
  }

  // Delete Assessment
  deleteAssessment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
