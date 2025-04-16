import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:6969/contracts';


  constructor(private http: HttpClient) {}

  // GET Request to Fetch Message
  getMessage(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // Expect JSON
  }
}
