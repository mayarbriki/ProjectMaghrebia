import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Incident {
  incident_id?: string; 
  reporter_id: string;
  linked_property: string;
  category: string;
  details: string;
  occurrence_date: string;
  resolution_status: string;
  evidence: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private baseUrl = 'http://localhost:6969/api/incidents';

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.baseUrl);
  }

  addIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.baseUrl, incident);
  }

  updateIncident(id: string, incident: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.baseUrl}/${id}`, incident);
  }

  deleteIncident(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
