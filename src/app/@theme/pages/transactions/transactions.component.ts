import { Component, OnInit } from '@angular/core';
import { TransactionService, Transaction } from '../../../transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];

  // ✅ Options de méthodes de paiement
  paymentMethods: string[] = ['PAYPAL', 'CREDIT_CARD', 'BANK_TRANSFER'];

  transactionForm: Transaction = {
    user_id: 0,
    amount: 0,
    payment_method: 'PAYPAL', // ✅ Méthode de paiement par défaut
    transaction_date: '',
    status: 'PENDING',
    contract_id: 0, // ✅ Ajout du champ contract_id
  };

  isEditing = false;
  editingTransactionId: number | null = null;
  errorMessage = '';

  // ✅ Ajout des statistiques
  validatedTransactionCount: number = 0;
  failedTransactionCount: number = 0;
  totalValidatedAmount: number = 0;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadStatistics(); // ✅ Charger les statistiques au démarrage
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

  loadStatistics(): void {
    // ✅ Charger le nombre de transactions validées
    this.transactionService.getTransactionCountByStatus('COMPLETED').subscribe(
      (count) => (this.validatedTransactionCount = count)
    );

    // ✅ Charger le nombre de transactions rejetées
    this.transactionService.getTransactionCountByStatus('FAILED').subscribe(
      (count) => (this.failedTransactionCount = count)
    );

    // ✅ Charger le total des montants validés
    this.transactionService.getSumValidatedTransactionsAmount().subscribe(
      (total) => (this.totalValidatedAmount = total)
    );
  }

  addTransaction(): void {
    const formattedDate = new Date(this.transactionForm.transaction_date).toISOString(); // ✅ Formatage de la date

    const transactionToSend = {
      ...this.transactionForm,
      transaction_date: formattedDate,
    };

    console.log('Transaction Payload:', transactionToSend); // ✅ Debug

    if (this.isEditing && this.editingTransactionId !== null) {
      this.transactionService.updateTransaction(this.editingTransactionId, transactionToSend).subscribe(() => {
        this.loadTransactions();
        this.loadStatistics(); // ✅ Mettre à jour les stats après modification
        this.resetForm();
      }, error => console.error('Update Error:', error));
    } else {
      this.transactionService.createTransaction(transactionToSend).subscribe(() => {
        this.loadTransactions();
        this.loadStatistics(); // ✅ Mettre à jour les stats après ajout
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
        this.loadStatistics(); // ✅ Mettre à jour les stats après suppression
      });
    }
  }

  resetForm(): void {
    this.transactionForm = {
      user_id: 0,
      amount: 0,
      payment_method: 'PAYPAL', // ✅ Réinitialisation de la valeur par défaut
      transaction_date: '',
      status: 'PENDING',
      contract_id: 0, // ✅ Réinitialisation de contract_id
    };
    this.isEditing = false;
    this.editingTransactionId = null;
  }
}
