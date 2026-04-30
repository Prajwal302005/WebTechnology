import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  // Receives transaction array from parent (HomeComponent)
  @Input() transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  // Delete a transaction by its ID
  delete(id: string): void {
    if (confirm('Delete this transaction?')) {
      this.transactionService.deleteTransaction(id);
    }
  }

  // Returns emoji icon per category
  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Food: '🍽️', Travel: '✈️', Bills: '🧾',
      Salary: '💼', Investment: '📈', Other: '📦'
    };
    return icons[category] ?? '📦';
  }
}
