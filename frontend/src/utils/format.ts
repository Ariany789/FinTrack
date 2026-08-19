export const currency = (value: string | number) => new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(Number(value))
export const dateFormat = (value: string) => new Intl.DateTimeFormat('pt-BR', {dateStyle:'medium'}).format(new Date(`${value}T12:00:00`))
