import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { CategoryExpense, Evolution } from '../types'
import { currency } from '../utils/format'
import { Card } from './ui'

const tooltipStyle = { background: '#151C19', border: '1px solid #27332E', borderRadius: 12, color: '#F2F5F3' }
const tooltipTextStyle = { color: '#F2F5F3' }

export function EvolutionChart({ data }: { data: Evolution[] }) {
  return <Card className="min-h-[390px] overflow-hidden">
    <div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="font-semibold">Evolução financeira</h2><p className="text-sm text-muted">Receitas, despesas e saldo ao longo do período.</p></div><span className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-muted">Visão anual</span></div>
    <ResponsiveContainer width="100%" height={292}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid stroke="#27332E" strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="date" stroke="#66736C" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#66736C" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipTextStyle} itemStyle={tooltipTextStyle} formatter={value => currency(value as string)} />
        <Line type="monotone" dataKey="income" name="Receitas" stroke="#39FF88" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="expense" name="Despesas" stroke="#FF5C6C" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="balance" name="Saldo" stroke="#FFD166" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
    <div className="mt-3 flex flex-wrap gap-4 text-sm"><span className="flex items-center gap-2 text-neon"><i className="h-2 w-2 rounded-full bg-neon" />Receitas</span><span className="flex items-center gap-2 text-danger"><i className="h-2 w-2 rounded-full bg-danger" />Despesas</span><span className="flex items-center gap-2 text-warning"><i className="h-2 w-2 rounded-full bg-warning" />Saldo</span></div>
  </Card>
}

export function CategoryChart({ data }: { data: CategoryExpense[] }) {
  const total = data.reduce((sum, item) => sum + Number(item.amount), 0)
  const categories = [...data].sort((first, second) => Number(second.amount) - Number(first.amount))

  return <Card className="min-h-[390px] overflow-hidden">
    <div className="mb-2 flex items-start justify-between gap-4"><div><h2 className="font-semibold">Despesas por categoria</h2><p className="text-sm text-muted">Distribuição e peso de cada gasto no mês.</p></div><span className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-muted">{data.length} categorias</span></div>
    {data.length ? <div className="grid items-center gap-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(280px,1.2fr)]">
      <div className="relative h-[250px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="amount" nameKey="name" innerRadius={68} outerRadius={104} paddingAngle={4} stroke="#151C19" strokeWidth={3}>{categories.map(category => <Cell key={category.id} fill={category.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} labelStyle={tooltipTextStyle} itemStyle={tooltipTextStyle} formatter={value => currency(value as string)} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-xs uppercase tracking-[0.18em] text-muted">Total</span><strong className="mt-1 text-xl">{currency(total)}</strong></div></div>
      <div className="space-y-4">{categories.map(category => { const percentage = total ? (Number(category.amount) / total) * 100 : 0; return <div key={category.id}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="flex min-w-0 items-center gap-2"><i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} /><span className="truncate">{category.name}</span></span><span className="shrink-0 font-semibold">{currency(category.amount)}</span></div><div className="h-2 overflow-hidden rounded-full bg-panel"><div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: category.color }} /></div><p className="mt-1 text-right text-xs text-muted">{percentage.toFixed(1)}% das despesas</p></div> })}</div>
    </div> : <div className="grid min-h-[270px] place-items-center rounded-2xl border border-dashed border-border bg-panel/50 text-center"><div><p className="font-medium">Ainda não há despesas neste período.</p><p className="mt-1 text-sm text-muted">Registre uma transação para ver sua distribuição aqui.</p></div></div>}
  </Card>
}
