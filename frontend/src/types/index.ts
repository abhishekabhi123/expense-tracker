export interface Expense {
  id: string;
  amount: string;
  category: string;
  description: string;
  date: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface CreateExpensePayload {
  amount: number;
  category: string;
  description: string;
  date: string;
  idempotencyKey: string;
}
