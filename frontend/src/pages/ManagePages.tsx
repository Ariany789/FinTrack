import { useQuery } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { CategoryChart, EvolutionChart } from '../components/charts'
import { Button, Card, EmptyState, LoadingState } from '../components/ui'
import { financeApi } from '../services/api'
import { currency } from '../utils/format'

export function CategoriesPage() {
  const query = useQuery({ queryKey: ['categories'], queryFn: financeApi.categories })
  const [name, setName] = useState('')
  if (query.isLoading) return <LoadingState />

  return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Categorias</h2><p className="text-muted">Personalize a classificação de seus movimentos.</p></div><Card><form className="mb-6 flex flex-wrap gap-3" onSubmit={async event => { event.preventDefault(); if (name.trim()) { await financeApi.createCategory({ name, color: '#39FF88', icon: 'tag' }); setName(''); query.refetch() } }}><input autoFocus className="max-w-sm flex-1" placeholder="Nome da nova categoria" value={name} onChange={event => setName(event.target.value)} /><Button type="submit"><Plus className="mr-2 inline" size={17} />Salvar categoria</Button></form>{query.data?.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{query.data.map(category => <div className="flex items-center justify-between rounded-xl border border-border p-4" key={category.id}><span className="flex items-center gap-3"><i className="h-3 w-3 rounded-full" style={{ background: category.color }} />{category.name}</span><button className="text-danger" onClick={async () => { if (confirm(`Excluir a categoria ${category.name}`)) { try { await financeApi.deleteCategory(category.id); query.refetch() } catch { alert('Não é possível excluir uma categoria que possui transações.') } } }} aria-label="Excluir categoria"><Trash2 size={17} /></button></div>)}</div> : <EmptyState />}</Card></div>
}

export function BudgetPage() {
  const budgets = useQuery({ queryKey: ['budgets'], queryFn: financeApi.budgets })
  const categories = useQuery({ queryKey: ['categories'], queryFn: financeApi.categories })
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingAmount, setEditingAmount] = useState('')

  const createBudget = async (event: FormEvent) => {
    event.preventDefault()
    if (!category || !amount) return
    await financeApi.createBudget({ category_id: Number(category), amount: Number(amount.replace(',', '.')), month: new Date().toISOString().slice(0, 10) })
    setAmount('')
    setCategory('')
    budgets.refetch()
  }

  const saveBudget = async (budgetId: number, categoryId: number, month: string) => {
    if (!editingAmount || Number(editingAmount.replace(',', '.')) < 0) return
    await financeApi.updateBudget(budgetId, { category_id: categoryId, amount: Number(editingAmount.replace(',', '.')), month })
    setEditingId(null)
    setEditingAmount('')
    budgets.refetch()
  }

  if (budgets.isLoading || categories.isLoading) return <LoadingState />

  return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Orçamento</h2><p className="text-muted">Defina limites mensais por categoria.</p></div><Card><form className="mb-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={createBudget}><select value={category} onChange={event => setCategory(event.target.value)}><option value="">Selecione a categoria</option>{categories.data?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><input inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value)} placeholder="Valor mensal" /><Button type="submit">Salvar orçamento</Button></form>{budgets.data?.length ? <div className="space-y-4">{budgets.data.map(budget => { const editing = editingId === budget.id; return <div className="rounded-xl border border-border p-4" key={budget.id}><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><span className="font-medium">{budget.category.name}</span><div className="flex items-center gap-2">{editing ? <><input autoFocus aria-label={`Novo valor para ${budget.category.name}`} className="!mt-0 w-32" inputMode="decimal" value={editingAmount} onChange={event => setEditingAmount(event.target.value)} /><button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-neon hover:bg-panel" onClick={() => saveBudget(budget.id, budget.category_id, budget.month)}>Salvar</button><button type="button" className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-panel" onClick={() => { setEditingId(null); setEditingAmount('') }}>Cancelar</button></> : <><span>{currency(budget.used)} de {currency(budget.amount)}</span><button type="button" className="rounded-lg p-2 text-neon hover:bg-panel" onClick={() => { setEditingId(budget.id); setEditingAmount(String(budget.amount).replace('.', ',')) }} aria-label={`Editar orçamento de ${budget.category.name}`}><Pencil size={17} /></button><button type="button" className="rounded-lg p-2 text-danger hover:bg-panel" onClick={async () => { if (confirm(`Excluir o orçamento de ${budget.category.name}?`)) { await financeApi.deleteBudget(budget.id); budgets.refetch() } }} aria-label={`Excluir orçamento de ${budget.category.name}`}><Trash2 size={17} /></button></>}</div></div><div className="h-2 overflow-hidden rounded-full bg-panel"><div className={budget.status === 'critical' ? 'bg-danger' : budget.status === 'attention' ? 'bg-warning' : 'bg-neon'} style={{ width: `${Math.min(budget.percentage, 100)}%`, height: '100%' }} /></div><div className="mt-2 flex justify-between text-sm text-muted"><span>{budget.percentage}% utilizado</span><span>Restam {currency(budget.remaining)}</span></div></div> })}</div> : <EmptyState message="Defina seu primeiro orçamento mensal." />}</Card></div>
}

export function ReportsPage() {
  const evolution = useQuery({ queryKey: ['reportEvolution'], queryFn: () => financeApi.evolution('year') })
  const categories = useQuery({ queryKey: ['reportCategories'], queryFn: financeApi.categoryExpenses })
  const summary = useQuery({ queryKey: ['reportSummary'], queryFn: financeApi.summary })
  if (evolution.isLoading) return <LoadingState />
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Relatórios</h2><p className="text-muted">Entenda sua evolução e padrões de consumo.</p></div><div className="grid gap-4 sm:grid-cols-3">{[['Receitas', summary.data?.income], ['Despesas', summary.data?.expense], ['Taxa de economia', `${summary.data?.savings_rate || 0}%`]].map(([label, value]) => <Card key={label as string}><p className="text-sm text-muted">{label as string}</p><p className="mt-2 text-2xl font-bold">{typeof value === 'string' && value.includes('%') ? value : currency(value as string)}</p></Card>)}</div><div className="grid gap-6 xl:grid-cols-2"><EvolutionChart data={evolution.data || []} /><CategoryChart data={categories.data || []} /></div></div>
}
