import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import type { Category, Transaction } from '../types'
import { Button } from './ui'

type TransactionPayload = {
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category_id: number
  date: string
  notes: string
}

type Props = {
  categories: Category[]
  transaction?: Transaction
  onClose: () => void
  onSave: (data: TransactionPayload) => Promise<void>
}

export function TransactionModal({ categories, transaction, onClose, onSave }: Props) {
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [form, setForm] = useState({
    description: transaction?.description || '',
    amount: transaction ? String(transaction.amount).replace('.', ',') : '',
    type: transaction?.type || 'EXPENSE',
    category_id: String(transaction?.category_id || categories[0]?.id || ''),
    date: transaction?.date || new Date().toISOString().slice(0, 10),
    notes: transaction?.notes || '',
  })

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    addEventListener('keydown', close)
    return () => removeEventListener('keydown', close)
  }, [onClose])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const amount = Number(form.amount.replace(',', '.'))
    if (!Number.isFinite(amount) || amount <= 0) {
      setSaveError('Informe um valor maior que zero.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      await onSave({ ...form, amount, category_id: Number(form.category_id) })
    } catch {
      setSaveError('Não foi possível salvar a transação. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Transação">
    <form onSubmit={submit} className="w-full max-w-lg rounded-2xl border border-border bg-panel p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-bold">{transaction ? 'Editar' : 'Adicionar'} transação</h2><button type="button" onClick={onClose} aria-label="Fechar"><X /></button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Tipo<select value={form.type} onChange={event => setForm({ ...form, type: event.target.value as 'INCOME' | 'EXPENSE' })}><option value="EXPENSE">Despesa</option><option value="INCOME">Receita</option></select></label>
        <label>Categoria<select required value={form.category_id} onChange={event => setForm({ ...form, category_id: event.target.value })}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="sm:col-span-2">Descrição<input autoFocus required value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label>
        <label>Valor<input required inputMode="decimal" pattern="[0-9]+([.,][0-9]{1,2})?" value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })} aria-describedby={saveError ? 'transaction-save-error' : undefined} /></label>
        <label>Data<input required type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /></label>
        <label className="sm:col-span-2">Observação<textarea value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} /></label>
      </div>
      {saveError && <p id="transaction-save-error" className="mt-4 text-sm text-danger" role="alert">{saveError}</p>}
      <div className="mt-6 flex justify-end gap-3"><Button type="button" className="bg-transparent text-muted hover:bg-card" onClick={onClose}>Cancelar</Button><Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar transação'}</Button></div>
    </form>
  </div>
}
