import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TransactionListComponent, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  balance = 0;
  totalIncome = 0;
  totalExpenses = 0;
  private sub!: Subscription;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Subscribe to reactive transactions stream
    this.sub = this.transactionService.transactions$.subscribe(() => {
      this.transactions = this.transactionService.getTransactions();
      this.balance = this.transactionService.getTotalBalance();
      this.totalIncome = this.transactionService.getTotalIncome();
      this.totalExpenses = this.transactionService.getTotalExpenses();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
