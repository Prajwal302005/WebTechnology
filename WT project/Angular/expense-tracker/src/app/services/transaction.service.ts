import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly STORAGE_KEY = 'expense_tracker_transactions';

  // BehaviorSubject allows components to reactively subscribe to changes
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadFromStorage());
  transactions$ = this.transactionsSubject.asObservable();

  constructor() {}

  // Load transactions from localStorage on init
  private loadFromStorage(): Transaction[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : this.getSampleData();
  }

  // Persist current state to localStorage
  private saveToStorage(transactions: Transaction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }

  // Get current snapshot of transactions
  getTransactions(): Transaction[] {
    return this.transactionsSubject.getValue();
  }

  // Add a new transaction and persist
  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId()
    };
    const updated = [newTransaction, ...this.getTransactions()];
    this.transactionsSubject.next(updated);
    this.saveToStorage(updated);
  }

  // Delete a transaction by ID
  deleteTransaction(id: string): void {
    const updated = this.getTransactions().filter(t => t.id !== id);
    this.transactionsSubject.next(updated);
    this.saveToStorage(updated);
  }

  // Calculate total balance (income - expenses)
  getTotalBalance(): number {
    return this.getTransactions().reduce((acc, t) =>
      t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  }

  // Sum of all income transactions
  getTotalIncome(): number {
    return this.getTransactions()
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }

  // Sum of all expense transactions
  getTotalExpenses(): number {
    return this.getTransactions()
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }

  // Generate a simple unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Sample data to demonstrate the app on first load
  private getSampleData(): Transaction[] {
    return [
      { id: '1', title: 'Monthly Salary', amount: 50000, date: '2026-04-01', type: 'income', category: 'Salary' },
      { id: '2', title: 'Grocery Shopping', amount: 3200, date: '2026-04-05', type: 'expense', category: 'Food' },
      { id: '3', title: 'Electricity Bill', amount: 1800, date: '2026-04-10', type: 'expense', category: 'Bills' },
      { id: '4', title: 'Weekend Trip', amount: 6500, date: '2026-04-15', type: 'expense', category: 'Travel' },
      { id: '5', title: 'Freelance Work', amount: 12000, date: '2026-04-20', type: 'income', category: 'Other' },
    ];
  }
}
