import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Property {
  property_id?: string; // Generated by backend
  owner_id: string;
  category: string;
  address: string;
  insurance_value: number;
  policy_type: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.baseUrl);
  }

  addProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, property);
  }

  updateProperty(id: string, property: Property): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, property);
  }

  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
