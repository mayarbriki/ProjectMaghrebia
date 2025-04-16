import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interface pour le formulaire
export interface Enrollment {
  nom: string;
  prenom: string;
  cin: string;
  formation: string;
  trainingId: number;
  userId: number;
  dateInscription: string;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private baseUrl = 'http://localhost:6969/api/enrollments';

  constructor(private http: HttpClient) {}

  // ✅ Envoi du formulaire d’inscription complet (POST avec body)
  inscrire(data: Enrollment): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      responseType: 'text' as 'text',
    });
  }

  // ✅ Vérifie si l’utilisateur est inscrit à une formation
  isEnrolled(userId: number, trainingId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('trainingId', trainingId);
    return this.http.get<boolean>(`${this.baseUrl}/check`, { params });
  }

  // ❌ Facultatif : inscription directe par ID (plus utilisée ici)
  // Garde cette méthode uniquement si tu veux déclencher une inscription auto
  enroll(userId: number, trainingId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('trainingId', trainingId);
    return this.http.post(this.baseUrl, null, { params });
  }
}
