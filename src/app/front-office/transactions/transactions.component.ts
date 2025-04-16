import { Component, OnInit } from '@angular/core';
import { TransactionService, Transaction } from '../../transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayementComponent } from "../payement/payement.component";
import { HeaderFrontComponent } from '../header-front/header-front.component';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PayementComponent, HeaderFrontComponent],
  selector: 'app-transaction',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = [];
  selectedTransaction: Transaction | null = null;
  paymentMethods: string[] = ['PAYPAL', 'CREDIT_CARD', 'BANK_TRANSFER']; 
  isEditing = false;
  editingTransactionId: number | null = null;
  errorMessage = '';
  successMessage = '';
  isValid = false;
  amountError = '';
  contractIdError = '';
  dateError = '';

  transactionForm: Transaction = {
    user_id: 0,
    amount: 0,
    payment_method: 'PAYPAL',
    transaction_date: '',
    status: 'PENDING',
    contract_id: 0
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(
      (data) => this.transactions = data,
      (error) => {
        this.errorMessage = '❌ Failed to load transactions.';
        console.error(error);
      }
    );
  }

  addTransaction(): void {
    if (!this.isValid) return;

    const formattedDate = new Date(this.transactionForm.transaction_date).toISOString();
    const transactionToSend = { 
      ...this.transactionForm, 
      transaction_date: formattedDate 
    };

    console.log("🟡 Sending Transaction Data:", transactionToSend);

    this.transactionService.createTransaction(transactionToSend).subscribe(
      () => {
        this.successMessage = '✅ Transaction added successfully!';
        this.loadTransactions();
        this.resetForm();
      },
      error => {
        this.errorMessage = '❌ Creation failed. Check console for details.';
        console.error("🔴 API Error:", error);
      }
    );
  }

  openPayment(transaction: Transaction): void {
    if (!transaction.transaction_id) {
      console.error("❌ Error: Transaction ID is missing!");
      alert("❌ Cannot process payment: Transaction ID is missing.");
      return;
    }
    this.selectedTransaction = { ...transaction };
  }

  handlePaymentCompletion(transactionId: number): void {
    console.log(`Payment successful for Transaction ID: ${transactionId}`);
    this.selectedTransaction = null;
    this.loadTransactions();
  }

  editTransaction(transaction: Transaction): void {
    this.transactionForm = { ...transaction };
    this.isEditing = true;
    this.editingTransactionId = transaction.transaction_id as number;
    this.validateForm();
  }

  deleteTransaction(id: number): void {
    if (confirm('⚠️ Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(
        () => {
          this.successMessage = '✅ Transaction deleted successfully!';
          this.transactions = this.transactions.filter(t => t.transaction_id !== id);
        },
        error => {
          this.errorMessage = '❌ Failed to delete transaction.';
          console.error(error);
        }
      );
    }
  }

  resetForm(): void {
    this.transactionForm = {
      user_id: 0,
      amount: 0,
      payment_method: 'PAYPAL',
      transaction_date: '',
      status: 'PENDING',
      contract_id: 0,
    };
    this.isEditing = false;
    this.editingTransactionId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.amountError = '';
    this.contractIdError = '';
    this.dateError = '';
    this.isValid = false;
  }

  validateForm(): void {
    const { amount, contract_id, transaction_date } = this.transactionForm;
    
    this.amountError = '';
    this.contractIdError = '';
    this.dateError = '';
    
    if (amount <= 0) {
      this.amountError = "❌ The amount must be greater than zero.";
    }

    if (!contract_id || contract_id <= 0 || isNaN(Number(contract_id))) {
      this.contractIdError = "❌ A valid contract ID is required.";
    }
    

    const today = new Date();
    const transactionDate = new Date(transaction_date);

    if (transactionDate > today) {
      this.dateError = "❌ The transaction date cannot be in the future.";
    }

    this.isValid = !this.amountError && !this.contractIdError && !this.dateError;
  }
}
