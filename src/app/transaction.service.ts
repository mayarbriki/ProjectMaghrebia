import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  transaction_id?: number;
  user_id: number;
  amount: number;
  payment_method: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER'; // ✅ Ensure only ENUM values are sent
  transaction_date: string; // ✅ Must be ISO format
  status: 'PENDING' | 'COMPLETED' | 'FAILED'; // ✅ Must match ENUM values
  created_at?: string;
  contract?: any;
}




@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:6969/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction); // ✅ Correct URL
  }
  

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`);
  }
}
