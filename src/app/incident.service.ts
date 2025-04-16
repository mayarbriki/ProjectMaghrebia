import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Incident {
  title: string;
  description: string;
  dateOfIncident: string;
  locationDetails?: string;
  severity: string;
  incidentCategory: string;
  incidentCause?: string;
  policeReportFiled?: boolean;
  insuranceClaimFiled?: boolean;
  userEmail: string;
  userPhone?: string;
  faultAcknowledged?: boolean;
  needsAssessment?: boolean;
  latitude: number;
  longitude: number;
  property?: { id: number };
  submittedAt?: string;
}


@Injectable({
  providedIn: 'root'
})

export class IncidentService {
  
  private apiUrl = `${environment.apiBaseUrl}/incidents`;

  constructor(private http: HttpClient) {}

  // Create new incident
  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, incident).pipe(
      catchError(this.handleError)
    );
  }

  // Get incidents by property ID
  getIncidentsByPropertyId(propertyId: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/property/${propertyId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get incident by ID
  getIncidentById(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update incident
  updateIncident(id: number, incident: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, incident).pipe(
      catchError(this.handleError)
    );
  }

  // Delete incident
  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}