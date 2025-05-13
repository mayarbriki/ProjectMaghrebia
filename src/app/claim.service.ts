import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from './models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private baseUrl = 'http://localhost:8089/claims';

  constructor(private http: HttpClient  ) { }

  // Create claim
  createClaim(claim: FormData): Observable<Claim> {
    return this.http.post<Claim>(`${this.baseUrl}/create`, claim);
  }

  // Get claim by ID
  getClaimById(id: string, userId: number | null, role: string): Observable<Claim> {
    let params = new HttpParams().set('role', role);
    if (role !== 'ADMIN' && userId !== null) {
      params = params.set('userId', userId);
    }
    return this.http.get<Claim>(`${this.baseUrl}/get/${id}`, { params });
  }

// Get all claims (optionnellement filtrés par userId)
getAllClaims(userId?: number): Observable<Claim[]> {
  let params = new HttpParams();

  if (userId !== undefined && userId !== null) {
    params = params.set('userId', userId);
  }

  return this.http.get<Claim[]>(`${this.baseUrl}/all`, { params });
}


  // Update claim
  updateClaim(id: string, claim: FormData | Claim, userId: number | null, role: string): Observable<Claim> {
    let params = new HttpParams().set('role', role);
    if (role !== 'ADMIN' && userId !== null) {
      params = params.set('userId', userId);
    }

    if (claim instanceof FormData) {
      return this.http.put<Claim>(`${this.baseUrl}/update/${id}`, claim, { params });
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.put<Claim>(`${this.baseUrl}/update/${id}`, claim, { headers, params });
    }
  }
  // Delete claim
  deleteClaim(id: string, userId: number | null, role: string): Observable<void> {
    let params = new HttpParams().set('role', role);
    if (role !== 'ADMIN' && userId !== null) {
      params = params.set('userId', userId);
    }
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { params });
  }

  // Update claim status
  updateClaimStatus(idClaim: string, newStatus: string, userId: number | null, role: string): Observable<Claim> {
    let params = new HttpParams()
      .set('status', newStatus)
      .set('role', role);

    if (role !== 'ADMIN' && userId !== null) {
      params = params.set('userId', userId);
    }

    return this.http.put<Claim>(`${this.baseUrl}/${idClaim}/status`, {}, { params });
  }

  getClaimsByUserId(userId: number): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/user/${userId}`);
  }
  
}
