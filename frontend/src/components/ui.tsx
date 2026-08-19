import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
export function Card({children,className=''}:PropsWithChildren<{className?:string}>){return <section className={`rounded-2xl border border-border bg-card p-5 shadow-panel ${className}`}>{children}</section>}
export function Button({children,className='',...props}:PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>){return <button className={`rounded-xl bg-neon px-4 py-2.5 text-sm font-bold text-base transition hover:bg-[#6effa7] disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>}
export function EmptyState({message='Seu controle financeiro começa aqui.'}:{message?:string}){return <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">{message}</div>}
export function LoadingState(){return <div className="animate-pulse rounded-2xl bg-card p-16 text-center text-muted">Carregando dados...</div>}
