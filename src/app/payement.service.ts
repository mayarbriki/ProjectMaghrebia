import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayementService {
  private apiUrl = 'http://localhost:6969/payments';

  constructor(private http: HttpClient) {}

  chargeCard(token: string, transactionId: number, amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/charge`, { token, transactionId, amount });
  }
  

  payWithPayPal(transactionId: number, amount: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/paypal`, { transactionId, amount });
  }
}
