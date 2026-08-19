import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { BudgetPage, CategoriesPage, ReportsPage } from './pages/ManagePages'
export default function App(){return <Routes><Route element={<AppLayout/>}><Route path="/" element={<DashboardPage/>}/><Route path="/transactions" element={<TransactionsPage/>}/><Route path="/categories" element={<CategoriesPage/>}/><Route path="/budget" element={<BudgetPage/>}/><Route path="/reports" element={<ReportsPage/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
