import { describe, it, expect } from 'vitest'
import { validateCurrencyCode, formatCurrency, parseMoney } from '../currency'

describe('validateCurrencyCode', () => {
  it('passes GBP', () => {
    const result = validateCurrencyCode('GBP')
    expect(result.valid).toBe(true)
  })

  it('passes lowercase gbp', () => {
    const result = validateCurrencyCode('gbp')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.value).toBe('GBP')
  })

  it('fails an unsupported code', () => {
    const result = validateCurrencyCode('XYZ')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toContain('Unsupported')
  })

  it('fails an empty string', () => {
    const result = validateCurrencyCode('')
    expect(result.valid).toBe(false)
  })
})

describe('formatCurrency', () => {
  it('formats GBP correctly for en-GB locale', () => {
    const result = formatCurrency(1000.5, 'GBP', 'en-GB')
    expect(result).toBe('£1,000.50')
  })

  it('formats USD correctly for en-US locale', () => {
    const result = formatCurrency(1000.5, 'USD', 'en-US')
    expect(result).toBe('$1,000.50')
  })

  it('formats JPY with no decimal places', () => {
    const result = formatCurrency(1000, 'JPY', 'ja-JP')
    expect(result).toContain('1,000')
    expect(result).not.toContain('.')
  })

  it('uses default locale when none is provided', () => {
    const result = formatCurrency(500, 'GBP')
    expect(result).toBe('£500.00')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0, 'GBP', 'en-GB')
    expect(result).toBe('£0.00')
  })

  it('formats negative amounts correctly', () => {
    const result = formatCurrency(-100, 'GBP', 'en-GB')
    expect(result).toBe('-£100.00')
  })
})

describe('parseMoney', () => {
  it('parses a GBP string', () => {
    const result = parseMoney('£1,000.50')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.amount).toBe(1000.5)
      expect(result.currency).toBe('GBP')
    }
  })

  it('parses a USD string', () => {
    const result = parseMoney('$500.00')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.amount).toBe(500)
      expect(result.currency).toBe('USD')
    }
  })

  it('parses a EUR string', () => {
    const result = parseMoney('€250.75')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.currency).toBe('EUR')
  })

  it('fails when no currency symbol is detected', () => {
    const result = parseMoney('1000.50')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toContain('Could not detect currency')
  })

  it('fails on empty string', () => {
    const result = parseMoney('')
    expect(result.valid).toBe(false)
  })
})
