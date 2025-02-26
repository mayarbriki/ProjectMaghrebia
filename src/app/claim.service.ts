import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from './models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private baseUrl = 'http://localhost:8089/claims';

  constructor(private http: HttpClient) { }

  // Create claim
  createClaim(claim: FormData): Observable<Claim> {
    return this.http.post<Claim>(`${this.baseUrl}/create`, claim);
  }

  // Get claim by ID
  getClaimById(id: string): Observable<Claim> {
    return this.http.get<Claim>(`${this.baseUrl}/get/${id}`);
  }

  // Get all claims
  getAllClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/all`);
  }

  // Update claim
  updateClaim(id: string, claim: FormData | Claim): Observable<Claim> {
    if (claim instanceof FormData) {
      return this.http.put<Claim>(`${this.baseUrl}/update/${id}`, claim);
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.put<Claim>(`${this.baseUrl}/update/${id}`, claim, { headers });
    }
  }
  // Delete claim
  deleteClaim(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
