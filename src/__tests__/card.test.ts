import { describe, it, expect } from 'vitest'
import { validateCardNumber } from '../card'

describe('validateCardNumber', () => {
  it('passes a valid Visa card number', () => {
    const result = validateCardNumber('4532015112830366')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.network).toBe('Visa')
      expect(result.last4).toBe('0366')
      expect(result.formatted).toBe('4532 0151 1283 0366')
    }
  })

  it('passes a valid Mastercard number', () => {
    const result = validateCardNumber('5425233430109903')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.network).toBe('Mastercard')
  })

  it('passes a card number with spaces', () => {
    const result = validateCardNumber('4532 0151 1283 0366')
    expect(result.valid).toBe(true)
  })

  it('passes a card number with hyphens', () => {
    const result = validateCardNumber('4532-0151-1283-0366')
    expect(result.valid).toBe(true)
  })

  it('fails a number that does not pass Luhn check', () => {
    const result = validateCardNumber('1234567890123456')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toContain('Luhn')
  })

  it('fails a number that is too short', () => {
    const result = validateCardNumber('123456789012')
    expect(result.valid).toBe(false)
  })

  it('fails a number with letters', () => {
    const result = validateCardNumber('453201511283036X')
    expect(result.valid).toBe(false)
  })

  it('fails an empty string', () => {
    const result = validateCardNumber('')
    expect(result.valid).toBe(false)
  })
})
