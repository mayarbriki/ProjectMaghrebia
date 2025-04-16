import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterModule } from '@angular/router';
import { SharedModule } from './demo/shared/shared.module';
import { ContractService } from './contract.service';
import { TransactionService } from './transaction.service';

@Component({
  selector: 'app-root',
  imports: [SharedModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ContractService]
})

export class AppComponent implements OnInit {
  title = 'Contract-app';
  contracts: any[] = [];
  private router = inject(Router);
  isSpinnerVisible = true;

  constructor(private contractService: ContractService) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    );
  }

  ngOnInit() {
    console.log('On init...');
    this.contractService.getContracts().subscribe(
      (data: any[]) => {
        this.contracts = data;
      },
      error => {
        console.error('Error fetching contracts:', error);
      }
    );
  }
  
}
