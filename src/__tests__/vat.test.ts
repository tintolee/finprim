import { describe, it, expect } from 'vitest'
import { validateEUVAT } from '../vat'

describe('validateEUVAT', () => {
  it('passes a valid German VAT number', () => {
    const result = validateEUVAT('DE123456789')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.countryCode).toBe('DE')
      expect(result.formatted).toBe('DE 123456789')
    }
  })

  it('passes a valid French VAT number', () => {
    const result = validateEUVAT('FR12345678901')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.countryCode).toBe('FR')
  })

  it('normalises spaces and case', () => {
    const result = validateEUVAT('de 123456789')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.value).toBe('DE123456789')
  })

  it('fails unsupported country code', () => {
    const result = validateEUVAT('XX123456789')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toContain('Unsupported')
  })

  it('fails invalid format for country', () => {
    const result = validateEUVAT('DE123')
    expect(result.valid).toBe(false)
  })

  it('fails empty string', () => {
    const result = validateEUVAT('')
    expect(result.valid).toBe(false)
  })
})
