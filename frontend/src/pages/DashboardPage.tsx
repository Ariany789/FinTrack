import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDownRight, ArrowUpRight, PiggyBank, Plus, Wallet } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryChart, EvolutionChart } from '../components/charts'
import { TransactionModal } from '../components/TransactionModal'
import { Button, Card, LoadingState } from '../components/ui'
import { financeApi } from '../services/api'
import { currency, dateFormat } from '../utils/format'

export function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [salary, setSalary] = useState('')
  const [savingSalary, setSavingSalary] = useState(false)
  const summary = useQuery({ queryKey: ['summary'], queryFn: financeApi.summary })
  const evolution = useQuery({ queryKey: ['evolution'], queryFn: () => financeApi.evolution() })
  const categories = useQuery({ queryKey: ['categories'], queryFn: financeApi.categories })
  const expenses = useQuery({ queryKey: ['categoryExpenses'], queryFn: financeApi.categoryExpenses })
  const recent = useQuery({ queryKey: ['recent'], queryFn: financeApi.recent })
  const insights = useQuery({ queryKey: ['insights'], queryFn: financeApi.insights })

  const refreshDashboard = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['summary'] }),
      queryClient.invalidateQueries({ queryKey: ['evolution'] }),
      queryClient.invalidateQueries({ queryKey: ['categoryExpenses'] }),
      queryClient.invalidateQueries({ queryKey: ['recent'] }),
      queryClient.invalidateQueries({ queryKey: ['insights'] }),
    ])
  }

  const saveSalary = async (event: FormEvent) => {
    event.preventDefault()
    const amount = Number(salary.replace(',', '.'))
    if (!amount || amount <= 0) return
    setSavingSalary(true)
    try {
      await financeApi.setSalary(amount)
      await refreshDashboard()
      setSalary('')
    } finally {
      setSavingSalary(false)
    }
  }

  if (summary.isLoading) return <LoadingState />

  const financialSummary = summary.data

  if (summary.isError || !financialSummary) {
    return <Card className="text-center">
      <p className="font-semibold text-danger">Não foi possível carregar seus dados financeiros.</p>
      <p className="mt-2 text-sm text-muted">Verifique se a API está em execução e tente novamente.</p>
      <Button className="mt-5" onClick={() => summary.refetch()}>Tentar novamente</Button>
    </Card>
  }

  const stats = [
    ['Saldo atual', financialSummary.balance, Wallet, 'text-neon'],
    ['Receitas', financialSummary.income, ArrowUpRight, 'text-neon'],
    ['Despesas', financialSummary.expense, ArrowDownRight, 'text-danger'],
    ['Economia', `${financialSummary.savings_rate}%`, PiggyBank, 'text-warning'],
  ] as const

  return <div className="space-y-6">
    <div><h2 className="text-2xl font-bold">Visão geral</h2><p className="mt-1 text-muted">Veja como estão suas finanças.</p></div>
    <Card className="flex flex-wrap items-center justify-between gap-4 border-neon/40 bg-gradient-to-r from-card to-[#15241c]">
      <div><p className="font-semibold text-neon">Lançamento rápido</p><p className="mt-1 text-sm text-muted">Registre uma nova despesa e veja seu saldo atualizar na hora.</p></div>
      <Button onClick={() => setModalOpen(true)}><Plus className="mr-2 inline" size={18} />Nova despesa</Button>
    </Card>
    <Card className="border-border bg-panel">
      <form className="flex flex-wrap items-end gap-4" onSubmit={saveSalary}>
        <div className="min-w-[220px] flex-1">
          <label htmlFor="salary">Qual é o seu salário mensal?</label>
          <input id="salary" required min="0.01" step="0.01" inputMode="decimal" placeholder="Ex.: 5000,00" value={salary} onChange={event => setSalary(event.target.value)} />
        </div>
        <Button disabled={savingSalary}>{savingSalary ? 'Salvando...' : 'Salvar salário'}</Button>
      </form>
      <p className="mt-3 text-xs text-muted">O valor será registrado como receita de salário neste mês e atualizará o dashboard.</p>
    </Card>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(([label, value, Icon, color]) => <Card key={label}><div className="flex justify-between"><p className="text-sm text-muted">{label}</p><Icon className={color} size={20} /></div><p className="mt-3 text-2xl font-bold">{typeof value === 'string' && value.includes('%') ? value : currency(value)}</p></Card>)}
    </div>
    {recent.data?.length === 0 ? <Card className="text-center"><p className="mb-4 text-muted">Seu controle financeiro começa aqui.</p><Button onClick={() => setModalOpen(true)}>Adicionar primeira despesa</Button></Card> : <>
      <div className="grid gap-6 xl:grid-cols-2"><EvolutionChart data={evolution.data || []} /><CategoryChart data={expenses.data || []} /></div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Últimas transações</h2><button onClick={() => navigate('/transactions')} className="text-sm text-neon">Ver todas</button></div><div className="space-y-3">{recent.data?.map(transaction => <div key={transaction.id} className="flex items-center justify-between rounded-xl bg-panel p-3"><div><p className="font-medium">{transaction.description}</p><p className="text-xs text-muted">{transaction.category.name} · {dateFormat(transaction.date)}</p></div><span className={transaction.type === 'INCOME' ? 'font-bold text-neon' : 'font-bold text-danger'}>{transaction.type === 'INCOME' ? '+' : '-'} {currency(transaction.amount)}</span></div>)}</div></Card>
        <Card><h2 className="mb-4 font-semibold">Insights financeiros</h2><div className="space-y-3">{insights.data?.map((insight, index) => <p key={index} className="rounded-xl border border-border p-3 text-sm text-muted">{insight.message}</p>)}</div></Card>
      </div>
    </>}
    {modalOpen && categories.data && <TransactionModal categories={categories.data} onClose={() => setModalOpen(false)} onSave={async data => { await financeApi.createTransaction(data); await refreshDashboard(); setModalOpen(false) }} />}
  </div>
}
