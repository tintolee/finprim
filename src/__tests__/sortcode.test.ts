import { describe, it, expect } from 'vitest'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode'

describe('validateUKSortCode', () => {
  it('passes a hyphenated sort code', () => {
    const result = validateUKSortCode('60-16-13')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.value).toBe('601613')
      expect(result.formatted).toBe('60-16-13')
    }
  })

  it('passes a plain 6-digit sort code', () => {
    const result = validateUKSortCode('601613')
    expect(result.valid).toBe(true)
  })

  it('passes a spaced sort code', () => {
    const result = validateUKSortCode('60 16 13')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.formatted).toBe('60-16-13')
    }
  })

  it('fails a sort code with too few digits', () => {
    const result = validateUKSortCode('1234')
    expect(result.valid).toBe(false)
  })

  it('fails a sort code with letters', () => {
    const result = validateUKSortCode('AB-CD-EF')
    expect(result.valid).toBe(false)
  })

  it('fails an empty string', () => {
    const result = validateUKSortCode('')
    expect(result.valid).toBe(false)
  })

  it('fails a sort code with 7 digits', () => {
    const result = validateUKSortCode('1234567')
    expect(result.valid).toBe(false)
  })
})

describe('validateUKAccountNumber', () => {
  it('passes a valid 8-digit account number', () => {
    const result = validateUKAccountNumber('31926819')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.value).toBe('31926819')
      expect(result.formatted).toBe('3192 6819')
    }
  })

  it('passes an account number with a space', () => {
    const result = validateUKAccountNumber('3192 6819')
    expect(result.valid).toBe(true)
  })

  it('fails a 7-digit account number', () => {
    const result = validateUKAccountNumber('1234567')
    expect(result.valid).toBe(false)
  })

  it('fails a 9-digit account number', () => {
    const result = validateUKAccountNumber('123456789')
    expect(result.valid).toBe(false)
  })

  it('fails an account number with letters', () => {
    const result = validateUKAccountNumber('1234ABCD')
    expect(result.valid).toBe(false)
  })

  it('fails an empty string', () => {
    const result = validateUKAccountNumber('')
    expect(result.valid).toBe(false)
  })
})
