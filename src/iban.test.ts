import { describe, it, expect } from 'vitest'
import { validateIBAN } from './iban'

describe('validateIBAN', () => {
  const VALID_GB = 'GB29NWBK60161331926819'
  const VALID_GB_SPACED = 'GB29 NWBK 6016 1331 9268 19'

  // -----------------------------
  // Success case
  // -----------------------------

  it('validates a correct IBAN', () => {
    const result = validateIBAN(VALID_GB)

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.value).toBe(VALID_GB)
      expect(result.formatted).toBe('GB29 NWBK 6016 1331 9268 19')
    }
  })

  it('accepts IBAN with spaces', () => {
    const result = validateIBAN(VALID_GB_SPACED)
    expect(result.valid).toBe(true)
  })

  it('normalizes lowercase input', () => {
    const result = validateIBAN(VALID_GB.toLowerCase())
    expect(result.valid).toBe(true)

    if (result.valid) {
      expect(result.value).toBe(VALID_GB)
    }
  })

  // -----------------------------
  // Failure case
  // -----------------------------

  it('fails if input is shorter than 4 characters', () => {
    const result = validateIBAN('GB2')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('IBAN is too short')
  })

  it('fails if length does not match country requirement', () => {
    const result = validateIBAN('GB29NWBK6016133192681') // one digit short
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Invalid length')
  })

  // -----------------------------
  // Country Validation
  // -----------------------------

  it('fails for unsupported country code', () => {
    const result = validateIBAN('ZZ29NWBK60161331926819')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Unsupported country code: ZZ')
  })

  // -----------------------------
  // Character Validation
  // -----------------------------

  it('fails if IBAN contains invalid characters', () => {
    const result = validateIBAN('GB29NWBK60161331926@19')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('IBAN contains invalid characters')
  })

  // -----------------------------
  // Checksum Validation
  // -----------------------------

  it('fails if checksum is invalid', () => {
    const result = validateIBAN('GB29NWBK60161331926810') // modified last digit
    expect(result.valid).toBe(false)
    expect(result.error).toBe('IBAN checksum is invalid')
  })

  // -----------------------------
  // Edge Cases
  // -----------------------------

  it('fails on empty string', () => {
    const result = validateIBAN('')
    expect(result.valid).toBe(false)
  })

  it('fails on whitespace only', () => {
    const result = validateIBAN('     ')
    expect(result.valid).toBe(false)
  })
})