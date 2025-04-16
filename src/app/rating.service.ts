import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class RatingService {
  private baseUrl = 'http://localhost:6969/ratings';

  constructor(private http: HttpClient) {}

  rateTraining(trainingId: number, value: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/training/${trainingId}`, { value });
  }

  getAverage(trainingId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/training/${trainingId}/average`);
  }
}
