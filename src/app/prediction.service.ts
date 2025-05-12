import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  age: number;
  gender: string;
  region: string;
  maritalStatus: string;
  occupation: string;
  incomeLevel: number;
  tenureYears: number;
  satisfactionScore: number;
  interestedInOtherProducts: string;
  marketingInteraction: string;
  preferredCommunicationChannel: string;
  purchaseAmount: number;
  isBookmarked: number;
  currentProduct: string;
  bookmarkedService: string;
  isHealthViewed: number;
  isAutoViewed: number;
  isRealEstateViewed: number;
}

export interface PredictionResponse {
  prediction: string;
  prediction_value: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:5000/predict';

  constructor(private http: HttpClient) { }

  getPrediction(data: PredictionRequest): Observable<PredictionResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PredictionResponse>(this.apiUrl, data, { headers });
  }
}