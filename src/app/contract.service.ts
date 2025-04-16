import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from './front-office/contracts/contracts.component';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = 'http://localhost:6969/contracts';

  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }

  createContract(contract: Contract): Observable<Contract> {
    contract.insurance_amount = this.calculateInsurance(contract.amount, contract.payment_type);
    return this.http.post<Contract>(this.apiUrl, contract);
}
  updateContract(id: number, contract: Contract): Observable<Contract> {
    contract.insurance_amount = this.calculateInsurance(contract.amount, contract.payment_type);

    return this.http.put<Contract>(`${this.apiUrl}/${id}`, contract);
  }

  deleteContract(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  downloadContractPDF(id: number): void {
    const pdfUrl = `${this.apiUrl}/${id}/pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = `contract_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  

public calculateInsurance(baseAmount: number, frequency: string): number {
  if (isNaN(baseAmount) || baseAmount === null || baseAmount === undefined) {
      baseAmount = 0; // ✅ Default value
  }

  switch (frequency) {
    case 'MONTHLY':
      return baseAmount / 12;
    case 'YEARLY':
      return baseAmount;
    case 'ONE_TIME':
      return baseAmount * 1.1;
    default:
      return baseAmount;
  }
}
}
