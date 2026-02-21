import { describe, it, expect } from 'vitest'
import { validateCreditCard } from './creditcard'

describe('validateCreditCard', () => {
  // -----------------------------
  // Success cases
  // -----------------------------

  it('validates a Visa card number', () => {
    const result = validateCreditCard('4111111111111111')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.value).toBe('4111111111111111')
      expect(result.formatted).toBe('4111 1111 1111 1111')
      expect(result.issuer).toBe('Visa')
    }
  })

  it('validates a Mastercard number', () => {
    const result = validateCreditCard('5500000000000004')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.formatted).toBe('5500 0000 0000 0004')
      expect(result.issuer).toBe('Mastercard')
    }
  })

  it('validates a Mastercard 2-series number', () => {
    const result = validateCreditCard('2223003122003222')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.formatted).toBe('2223 0031 2200 3222')
      expect(result.issuer).toBe('Mastercard')
    }
  })

  it('validates an American Express card number', () => {
    const result = validateCreditCard('378282246310005')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.formatted).toBe('3782 822463 10005')
      expect(result.issuer).toBe('AmericanExpress')
    }
  })

  it('validates a Discover card number', () => {
    const result = validateCreditCard('6011111111111117')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.formatted).toBe('6011 1111 1111 1117')
      expect(result.issuer).toBe('Discover')
    }
  })

  it('accepts card number with spaces', () => {
    const result = validateCreditCard('4111 1111 1111 1111')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.value).toBe('4111111111111111')
      expect(result.issuer).toBe('Visa')
    }
  })

  it('accepts card number with hyphens', () => {
    const result = validateCreditCard('4111-1111-1111-1111')

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.value).toBe('4111111111111111')
    }
  })

  // -----------------------------
  // Failure cases — character / length / Luhn errors
  // -----------------------------

  it('fails if input contains non-digit characters', () => {
    const result = validateCreditCard('4111111111111X11')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('digits')
    }
  })

  it('fails if card number is too short', () => {
    const result = validateCreditCard('411111111111')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('length is invalid')
    }
  })

  it('fails if card number is too long', () => {
    const result = validateCreditCard('41111111111111111111')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('length is invalid')
    }
  })

  it('fails if Luhn check does not pass', () => {
    const result = validateCreditCard('4111111111111112')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('Luhn')
    }
  })

  it('fails if AmericanExpress card is not 15 digits', () => {
    // Amex prefix but 16 digits — wrong length
    const result = validateCreditCard('3782822463100050')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('American Express')
    }
  })

  it('fails if Visa card is not 16 digits', () => {
    // Valid Luhn 13-digit Visa prefix — wrong length for Visa
    const result = validateCreditCard('4222222222222')

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('Visa')
    }
  })

  // -----------------------------
  // Edge Cases — empty, whitespace-only, all-zeros
  // -----------------------------

  it('fails on empty string', () => {
    const result = validateCreditCard('')

    expect(result.valid).toBe(false)
  })

  it('fails on whitespace only', () => {
    const result = validateCreditCard('   ')

    expect(result.valid).toBe(false)
  })

  it('fails on all-zeros input', () => {
    const result = validateCreditCard('0000000000000000')

    expect(result.valid).toBe(false)
  })
})
