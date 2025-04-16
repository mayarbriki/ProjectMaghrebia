import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private backendUrl = 'http://192.168.1.12:8081'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  generateVideo(property: { name: string; imageFolder: string }) {
    return this.http.post(`${this.backendUrl}/api/generate-video`, property, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the error here (e.g., log it, show a message to the user)
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
}