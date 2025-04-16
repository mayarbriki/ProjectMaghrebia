import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContractService } from 'src/app/contract.service';
import { Router } from '@angular/router';
import { HeaderFrontComponent } from '../header-front/header-front.component';

export interface Contract {
  contract_id?: number;
  user_id?: number;
  contract_type: 'TOUS_RISQUE' | 'NORMAL' | 'MINIMAL';
  start_date?: string;
  end_date?: string;
  amount: number;
  insurance_amount: number;
  payment_type: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
  signed_document?: string;
}

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderFrontComponent],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  contracts: Contract[] = [];
  currentContract: Contract = { contract_id: 0, amount: 0, insurance_amount: 0, payment_type: 'YEARLY', contract_type: 'NORMAL' };
  riskScore: string = 'N/A';  // 🚀 Affichage du risque de sinistre
  weatherAlert: string = '';  // 🚀 Message d'alerte météo
  isEditing: boolean = false;
  calculatedAmount: number = 0;
  isValid: boolean = false;
  dateError: string = "";
  amountError: string = "";

  constructor(private contractService: ContractService, private router: Router,) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  navigateToTransaction(): void {
    this.router.navigate(['/transactions']);
  }

  loadContracts(): void {
    this.contractService.getContracts().subscribe(
      (data: Contract[]) => (this.contracts = data),
      (error) => console.error('Error fetching contracts:', error)
    );
  }

  editContract(contract: Contract): void {
    this.currentContract = { ...contract };
    this.isEditing = true;
    this.updateAmount();
    this.validateForm();
  }

  cancel(): void {
    this.currentContract = { contract_id: 0, amount: 0, insurance_amount: 0, payment_type: 'YEARLY', contract_type: 'NORMAL' };
    this.isEditing = false;
    this.calculatedAmount = 0;
    this.isValid = false;
    this.dateError = "";
    this.amountError = "";
  }

  saveContract(): void {
    let contractToSave = { ...this.currentContract };
    
    if (contractToSave.amount === undefined || contractToSave.amount === null || isNaN(contractToSave.amount)) {
        contractToSave.amount = 0;
    }

    if (contractToSave.contract_id === 0) {
        contractToSave.contract_id = undefined; 
    }

    this.contractService.createContract(contractToSave).subscribe(
        (response) => {
            console.log("Contract created successfully", response);
            this.loadContracts();
            this.cancel();
        },
        (error) => {
            console.error("Error creating contract:", error);
        }
    );
  }

  deleteContract(id: number): void {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.contractService.deleteContract(id).subscribe(
        () => this.loadContracts(),
        (error) => console.error('Error deleting contract:', error)
      );
    }
  }

  updateAmount(): void {
    this.calculatedAmount = this.calculateInsurance(
      this.currentContract.amount || 0,
      this.currentContract.contract_type || 'NORMAL',
      this.currentContract.payment_type || 'YEARLY'
    );
    this.validateForm();
  }

  calculateInsurance(declaredAmount: number, contractType: string, paymentType: string): number {
    let baseInsurance = 0;

    switch (contractType) {
      case 'TOUS_RISQUE':
        baseInsurance = declaredAmount * 0.10;
        break;
      case 'NORMAL':
        baseInsurance = declaredAmount * 0.05;
        break;
      case 'MINIMAL':
        baseInsurance = declaredAmount * 0.02;
        break;
      default:
        baseInsurance = 0;
    }

    switch (paymentType) {
      case 'MONTHLY':
        return baseInsurance / 12;
      case 'YEARLY':
        return baseInsurance;
      case 'ONE_TIME':
        return baseInsurance * 1.1;
      default:
        return baseInsurance;
    }
  }

  validateForm(): void {
    const { start_date, end_date, amount } = this.currentContract;

    this.dateError = "";
    this.amountError = "";

    if (!start_date || !end_date) {
      this.isValid = false;
      return;
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const minEndDate = new Date(startDate);
    minEndDate.setMonth(minEndDate.getMonth() + 1); 

    if (endDate < minEndDate) {
      this.dateError = "❌ La date de fin doit être au moins 1 mois après la date de début.";
    }

    if (amount <= 0) {
      this.amountError = "❌ Le montant doit être supérieur à zéro.";
    }

    this.isValid = !this.dateError && !this.amountError;
  }
  sortAscending: boolean = true; // ✅ Indique si on trie en ordre croissant

sortByAmount(): void {
  this.sortAscending = !this.sortAscending; // ✅ Alterner entre croissant et décroissant
  this.contracts.sort((a, b) => {
    return this.sortAscending ? a.amount - b.amount : b.amount - a.amount;
  });
}

}
