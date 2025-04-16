import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SinistrePredictionService {
  private apiUrl = 'http://localhost:6969/predict-risk';
  constructor(private http: HttpClient) {}

  getRiskPrediction(contract: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contract);
  }
}
