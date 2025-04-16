import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContractService } from 'src/app/contract.service';

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contrats.component.html',
  styleUrls: ['./contrats.component.scss']
})
export class ContratsComponent implements OnInit {
  contracts: any[] = [];
  currentContract: any = {};
  isEditing: boolean = false;
  expiredContracts: any[] = []; // ✅ Liste des contrats expirés
  sortAscending: boolean = true; // ✅ Tri des montants

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  // ✅ Charger les contrats et vérifier lesquels sont expirés
  loadContracts(): void {
    this.contractService.getContracts().subscribe(
      (data: any[]) => {
        this.contracts = data;
        this.checkExpiredContracts();
      },
      error => console.error('Error fetching contracts:', error)
    );
  }

  // ✅ Vérifier quels contrats sont expirés
  checkExpiredContracts(): void {
    const today = new Date();
    this.expiredContracts = this.contracts.filter(contract => {
      if (contract.end_date) {
        const contractEndDate = new Date(contract.end_date);
        return contractEndDate < today;
      }
      return false;
    });
  }

  // ✅ Fonction de tri des montants
  sortByAmount(): void {
    this.sortAscending = !this.sortAscending; // ✅ Alterner entre croissant et décroissant
    this.contracts.sort((a, b) => {
      return this.sortAscending ? a.amount - b.amount : b.amount - a.amount;
    });
  }

  // ✅ Éditer un contrat
  editContract(contract: any): void {
    this.currentContract = { ...contract };
    this.isEditing = true;
  }

  // ✅ Annuler l'édition
  cancel(): void {
    this.currentContract = {};
    this.isEditing = false;
  }

  // ✅ Sauvegarde d'un contrat
  saveContract(form: NgForm): void {
    if (form.invalid) {
      console.error('Form is invalid');
      return;
    }

    if (this.isEditing) {
      this.contractService.updateContract(this.currentContract.contract_id, this.currentContract).subscribe(
        res => {
          this.loadContracts();
          this.cancel();
        },
        error => console.error('Error updating contract:', error)
      );
    } else {
      this.contractService.createContract(this.currentContract).subscribe(
        res => {
          this.loadContracts();
          this.cancel();
        },
        error => console.error('Error creating contract:', error)
      );
    }
  }

  // ✅ Supprimer un contrat
  deleteContract(id: number): void {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.contractService.deleteContract(id).subscribe(
        res => this.loadContracts(),
        error => console.error('Error deleting contract:', error)
      );
    }
  }

  // ✅ Télécharger un contrat PDF
  downloadContractPDF(id: number): void {
    this.contractService.downloadContractPDF(id);
  }
}
