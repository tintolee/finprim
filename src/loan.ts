import { guardNumber } from './_guard'

export type LoanScheduleEntry = {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

const MAX_LOAN_MONTHS = 3600

export function calculateEMI(
  principal: number,
  annualRatePercent: number,
  months: number
): number {
  const p = guardNumber(principal, { min: 0, label: 'Principal' })
  const m = guardNumber(months, { min: 1, max: MAX_LOAN_MONTHS, integer: true, label: 'Months' })
  const rate = guardNumber(annualRatePercent, { min: 0, label: 'Annual rate' })
  if (!p.ok || !m.ok || !rate.ok) return 0

  if (rate.value === 0) return p.value / m.value
  const r = rate.value / 100 / 12
  return p.value * (r * (1 + r) ** m.value) / ((1 + r) ** m.value - 1)
}

export function getLoanSchedule(
  principal: number,
  annualRatePercent: number,
  months: number
): LoanScheduleEntry[] {
  const emi = calculateEMI(principal, annualRatePercent, months)
  if (emi === 0) return []

  const p = guardNumber(principal, { min: 0, label: 'Principal' })
  const m = guardNumber(months, { min: 1, max: MAX_LOAN_MONTHS, integer: true, label: 'Months' })
  const rate = guardNumber(annualRatePercent, { min: 0, label: 'Annual rate' })
  if (!p.ok || !m.ok || !rate.ok) return []

  const r = rate.value / 100 / 12
  const schedule: LoanScheduleEntry[] = []
  let balance = p.value

  for (let month = 1; month <= m.value; month++) {
    const interest = balance * r
    const principalPayment = emi - interest
    balance = Math.max(0, balance - principalPayment)
    schedule.push({
      month,
      payment: emi,
      principal: principalPayment,
      interest,
      balance,
    })
  }

  return schedule
}
