import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private baseUrl = 'http://localhost:6969/api/certificates'; // ✅ un seul slash ici

  constructor(private http: HttpClient) {}

  generate(trainingId: number, userId: number): Observable<string> {
    const params = new HttpParams()
      .set('trainingId', trainingId)
      .set('userId', userId);
    return this.http.post(this.baseUrl, null, { params, responseType: 'text' });
  }
}
