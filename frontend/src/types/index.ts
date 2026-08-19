export type TransactionType = 'INCOME' | 'EXPENSE'
export interface Category { id: number; name: string; color: string; icon: string; created_at: string }
export interface Transaction { id: number; description: string; amount: string; type: TransactionType; category_id: number; category: Category; date: string; notes?: string; created_at: string; updated_at: string }
export interface Summary { income: string; expense: string; balance: string; savings_rate: number }
export interface Evolution { date: string; income: string; expense: string; balance: string }
export interface CategoryExpense { id: number; name: string; color: string; amount: string; percentage: number }
export interface Budget { id: number; category_id: number; category: Category; amount: string; month: string; used: string; remaining: string; percentage: number; status: 'normal'|'attention'|'critical' }
