import axios from 'axios'
import type { Budget, Category, CategoryExpense, Evolution, Summary, Transaction } from '../types'
const api = axios.create({ baseURL: window.fintrack?.apiBaseUrl || import.meta.env.VITE_API_URL || '/api/v1', timeout: 10000 })
export const financeApi = {
  summary: () => api.get<Summary>('/dashboard/summary').then(r => r.data), evolution: (period = 'month') => api.get<Evolution[]>('/dashboard/evolution', {params:{period}}).then(r => r.data), categoryExpenses: () => api.get<CategoryExpense[]>('/dashboard/categories').then(r => r.data), recent: () => api.get<Transaction[]>('/dashboard/recent-transactions').then(r => r.data),
  setSalary: (amount: number) => api.put<Transaction>('/dashboard/salary', { amount }).then(r => r.data),
  transactions: (params = {}) => api.get<{items: Transaction[]; total: number; page: number; total_pages: number}>('/transactions', {params}).then(r => r.data), createTransaction: (data: object) => api.post<Transaction>('/transactions', data).then(r => r.data), updateTransaction: (id:number,data:object) => api.put<Transaction>(`/transactions/${id}`,data).then(r => r.data), deleteTransaction: (id:number) => api.delete(`/transactions/${id}`),
  categories: () => api.get<Category[]>('/categories').then(r => r.data), createCategory:(data:object)=>api.post<Category>('/categories',data).then(r=>r.data), updateCategory:(id:number,data:object)=>api.put<Category>(`/categories/${id}`,data).then(r=>r.data), deleteCategory:(id:number)=>api.delete(`/categories/${id}`),
  budgets: () => api.get<Budget[]>('/budgets').then(r=>r.data), createBudget:(data:object)=>api.post<Budget>('/budgets',data).then(r=>r.data), updateBudget:(id:number,data:object)=>api.put<Budget>(`/budgets/${id}`,data).then(r=>r.data), deleteBudget:(id:number)=>api.delete(`/budgets/${id}`), insights:()=>api.get<{type:string;message:string}[]>('/insights').then(r=>r.data)
}
