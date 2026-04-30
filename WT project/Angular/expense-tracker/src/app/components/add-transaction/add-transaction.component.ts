import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent {
  // Category options (income + expense share these)
  categories = ['Food', 'Travel', 'Bills', 'Salary', 'Investment', 'Other'];

  // Success/error feedback
  submitted = false;
  errorMsg = '';

  // Reactive Form definition with validators
  txForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.txForm = this.fb.group({
      title:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      amount:   [null, [Validators.required, Validators.min(1)]],
      date:     [new Date().toISOString().split('T')[0], Validators.required], // default: today
      type:     ['expense', Validators.required],
      category: ['Other', Validators.required]
    });
  }

  // Convenience getter for template access
  get f() { return this.txForm.controls; }

  // Handle form submission
  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';

    if (this.txForm.invalid) return;

    try {
      this.transactionService.addTransaction({
        title:    this.f['title'].value.trim(),
        amount:   Number(this.f['amount'].value),
        date:     this.f['date'].value,
        type:     this.f['type'].value,
        category: this.f['category'].value
      });
      // Navigate back to home after adding
      this.router.navigate(['/']);
    } catch {
      this.errorMsg = 'Failed to save. Please try again.';
    }
  }

  // Reset form
  onReset(): void {
    this.submitted = false;
    this.txForm.reset({
      type: 'expense',
      category: 'Other',
      date: new Date().toISOString().split('T')[0]
    });
  }
}
