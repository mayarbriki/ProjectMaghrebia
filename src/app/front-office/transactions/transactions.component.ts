import { Component, OnInit } from '@angular/core';
import { TransactionService, Transaction } from '../../transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports:[CommonModule,ReactiveFormsModule,FormsModule],
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionForm: Transaction = {
    user_id: 0,
    amount: 0,
    payment_method: 'CASH', // ✅ Use a valid default enum value
    transaction_date: '',
    status: 'PENDING' // ✅ Use a valid default enum value
  };
  

  isEditing = false;
  editingTransactionId: number | null = null;
  errorMessage = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(
      (data) => (this.transactions = data),
      (error) => {
        this.errorMessage = 'Failed to load transactions.';
        console.error(error);
      }
    );
  }

  addTransaction(): void {
    const formattedDate = new Date(this.transactionForm.transaction_date).toISOString(); // Convert date
  
    const transactionToSend = {
      ...this.transactionForm,
      transaction_date: formattedDate
    };
  
    console.log('Transaction Payload:', transactionToSend); // ✅ Debug the request data
  
    if (this.isEditing && this.editingTransactionId !== null) {
      this.transactionService.updateTransaction(this.editingTransactionId, transactionToSend).subscribe(() => {
        this.loadTransactions();
        this.resetForm();
      }, error => console.error('Update Error:', error));
    } else {
      this.transactionService.createTransaction(transactionToSend).subscribe(() => {
        this.loadTransactions();
        this.resetForm();
      }, error => console.error('Create Error:', error));
    }
  }
  
  

  editTransaction(transaction: Transaction): void {
    this.transactionForm = { ...transaction };
    this.isEditing = true;
    this.editingTransactionId = transaction.transaction_id as number;
  }
  
  
  

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.transactions = this.transactions.filter((t) => t.transaction_id !== id);
      });
    }
  }

  resetForm(): void {
    this.transactionForm = {
      user_id: 0,
      amount: 0,
      payment_method: 'CASH',
      transaction_date: '',
      status: 'PENDING',
    };
    this.isEditing = false;
    this.editingTransactionId = null;
  }
}
