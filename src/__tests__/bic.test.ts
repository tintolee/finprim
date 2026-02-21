import { describe, it, expect } from 'vitest'
import { validateBIC } from '../bic'

describe('validateBIC', () => {
  it('passes a valid 8-character BIC', () => {
    const result = validateBIC('NWBKGB2L')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.value).toBe('NWBKGB2L')
  })

  it('passes a valid 11-character BIC', () => {
    const result = validateBIC('NWBKGB2LXXX')
    expect(result.valid).toBe(true)
  })

  it('passes a German BIC', () => {
    const result = validateBIC('DEUTDEDB')
    expect(result.valid).toBe(true)
  })

  it('normalises lowercase input', () => {
    const result = validateBIC('nwbkgb2l')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.value).toBe('NWBKGB2L')
  })

  it('fails a BIC with wrong length', () => {
    const result = validateBIC('NWBK')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toContain('8 or 11')
  })

  it('fails a BIC with invalid bank code (numbers)', () => {
    const result = validateBIC('1234GB2L')
    expect(result.valid).toBe(false)
  })

  it('fails an empty string', () => {
    const result = validateBIC('')
    expect(result.valid).toBe(false)
  })
})
