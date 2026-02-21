import { describe, it, expect } from 'vitest'
import { validateIBAN } from '../iban'

describe('validateIBAN', () => {

  it('passes a valid UK IBAN', () => {
    const result = validateIBAN('GB29NWBK60161331926819')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.value).toBe('GB29NWBK60161331926819')
      expect(result.formatted).toBe('GB29 NWBK 6016 1331 9268 19')
      expect(result.countryCode).toBe('GB')
    }
  })

  it('passes a valid UK IBAN with spaces', () => {
    const result = validateIBAN('GB29 NWBK 6016 1331 9268 19')
    expect(result.valid).toBe(true)
  })

  it('passes a valid German IBAN', () => {
    const result = validateIBAN('DE89370400440532013000')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.countryCode).toBe('DE')
  })

  it('passes a valid Dutch IBAN', () => {
    const result = validateIBAN('NL91ABNA0417164300')
    expect(result.valid).toBe(true)
  })

  it('normalises lowercase input', () => {
    const result = validateIBAN('gb29nwbk60161331926819')
    expect(result.valid).toBe(true)
  })

  // Invalid IBANs
  it('fails an invalid checksum', () => {
    const result = validateIBAN('GB00NWBK60161331926819')
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('checksum')
    }
  })

  it('fails an unsupported country code', () => {
    const result = validateIBAN('XX29NWBK60161331926819')
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('Unsupported country code')
    }
  })

  it('fails when too short', () => {
    const result = validateIBAN('GB29')
    expect(result.valid).toBe(false)
  })

  it('fails wrong length for country', () => {
    const result = validateIBAN('GB29NWBK601613')
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('Invalid length')
    }
  })

  it('fails with invalid characters', () => {
    const result = validateIBAN('GB29NWBK6016133192681!')
    expect(result.valid).toBe(false)
  })

  it('fails on empty string', () => {
    const result = validateIBAN('')
    expect(result.valid).toBe(false)
  })
})
