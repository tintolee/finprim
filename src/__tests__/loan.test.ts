import { describe, it, expect } from 'vitest'
import { calculateEMI, getLoanSchedule } from '../loan'

describe('calculateEMI', () => {
  it('returns zero for zero principal', () => {
    expect(calculateEMI(0, 5, 12)).toBe(0)
  })

  it('returns principal/months when rate is zero', () => {
    expect(calculateEMI(12000, 0, 12)).toBe(1000)
  })

  it('returns correct EMI for typical loan', () => {
    const emi = calculateEMI(100000, 10, 12)
    expect(emi).toBeGreaterThan(8000)
    expect(emi).toBeLessThan(9000)
    expect(Number(emi.toFixed(2))).toBe(8791.59)
  })

  it('returns zero for zero months', () => {
    expect(calculateEMI(10000, 5, 0)).toBe(0)
  })

  it('returns zero for NaN or invalid principal', () => {
    expect(calculateEMI(Number.NaN, 5, 12)).toBe(0)
    expect(calculateEMI(-1000, 5, 12)).toBe(0)
  })

  it('returns zero for invalid months', () => {
    expect(calculateEMI(10000, 5, 0.5)).toBe(0)
    expect(calculateEMI(10000, 5, Number.POSITIVE_INFINITY)).toBe(0)
  })
})

describe('getLoanSchedule', () => {
  it('returns one entry per month', () => {
    const schedule = getLoanSchedule(10000, 12, 12)
    expect(schedule).toHaveLength(12)
    const first = schedule[0]
    const last = schedule[11]
    expect(first).toBeDefined()
    expect(last).toBeDefined()
    if (first) expect(first.month).toBe(1)
    if (last) expect(last.month).toBe(12)
  })

  it('first payment includes interest and principal', () => {
    const schedule = getLoanSchedule(10000, 12, 12)
    const first = schedule[0]
    expect(first).toBeDefined()
    if (first) {
      expect(first.interest).toBeGreaterThan(0)
      expect(first.principal).toBeGreaterThan(0)
      expect(first.payment).toBe(first.interest + first.principal)
    }
  })

  it('final balance is zero', () => {
    const schedule = getLoanSchedule(10000, 12, 12)
    const last = schedule[11]
    expect(last).toBeDefined()
    if (last) expect(last.balance).toBeCloseTo(0, 10)
  })

  it('returns empty schedule for invalid inputs', () => {
    expect(getLoanSchedule(Number.NaN, 12, 12)).toEqual([])
    expect(getLoanSchedule(-1000, 12, 12)).toEqual([])
    expect(getLoanSchedule(10000, 12, 0)).toEqual([])
  })
})
