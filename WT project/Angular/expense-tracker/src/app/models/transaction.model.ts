// Transaction model defining the shape of each transaction
export interface Transaction {
  id: string;           // Unique identifier (UUID)
  title: string;        // Description of transaction
  amount: number;       // Positive number; type determines +/-
  date: string;         // ISO date string
  type: 'income' | 'expense';
  category: 'Food' | 'Travel' | 'Bills' | 'Other' | 'Salary' | 'Investment';
}
