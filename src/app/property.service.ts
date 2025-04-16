import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PropertyType } from "./front-office/property/properties/properties.component";

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8081/api/properties'; // Default API URL
  private newApiUrl = 'http://192.168.1.12:8081/api/properties'; // New API URL for specific functionalities

  constructor(private http: HttpClient) { }

  // Keep all existing functions as they are using the old URL
  getAllProperties(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPropertiesByType(type: PropertyType): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type/${type}`);
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProperty(property: any, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('property', new Blob([JSON.stringify(property)], { type: 'application/json' }));

    files.forEach(file => formData.append('images', file));

    return this.http.post<any>(this.apiUrl, formData);
  }

  updateProperty(id: number, property: any, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('property', new Blob([JSON.stringify(property)], { type: 'application/json' }));

    files.forEach(file => formData.append('images', file));

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  uploadImages(propertyId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    return this.http.post<any>(`${this.apiUrl}/${propertyId}/images`, formData);
  }

  getPropertyImages(propertyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${propertyId}/images`);
  }

  // **EXISTING IMAGE FUNCTION - UNTOUCHED**
  getImageUrl(image: any): string {
    if (typeof image === 'string') {
      return image;
    } else if (typeof image === 'number') {
      return `${this.apiUrl}/images/${image}`;
    } else if (image && image.filePath) {
      const normalizedPath = image.filePath.replace(/\\/g, '/');
      return `http://localhost:8081/${normalizedPath}`;
    }
    return '';
  }

  deleteImage(imageId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/images/${imageId}`);
  }

  // **NEW FUNCTIONALITY USING THE NEW URL**
  getPropertyByIdFromNewApi(id: number): Observable<any> {
    return this.http.get<any>(`${this.newApiUrl}/${id}`);
  }

  createPropertyInNewApi(property: any, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('property', new Blob([JSON.stringify(property)], { type: 'application/json' }));

    files.forEach(file => formData.append('images', file));

    return this.http.post<any>(this.newApiUrl, formData);
  }

  deletePropertyFromNewApi(id: number): Observable<any> {
    return this.http.delete(`${this.newApiUrl}/${id}`, { responseType: 'text' });
  }

  sendMail(property: any, recipient: string): Observable<any> {
    const payload = {
      property: property,
      recipient: recipient
    };
    return this.http.post(`${this.apiUrl}/sendMail`, payload);
  }

  downloadExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' });
  }
}
