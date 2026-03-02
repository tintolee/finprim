import { describe, it, expect } from 'vitest'
import { validateUSRoutingNumber } from '../routing'

describe('validateUSRoutingNumber', () => {
  it('passes a valid routing number', () => {
    const result = validateUSRoutingNumber('021000021')
    expect(result.valid).toBe(true)
    if (result.valid) expect(result.value).toBe('021000021')
  })

  it('passes another valid routing number', () => {
    const result = validateUSRoutingNumber('111900659')
    expect(result.valid).toBe(true)
  })

  it('fails invalid checksum', () => {
    const result = validateUSRoutingNumber('021000022')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toContain('checksum')
  })

  it('fails wrong length', () => {
    const result = validateUSRoutingNumber('12345678')
    expect(result.valid).toBe(false)
  })

  it('fails non-digits', () => {
    const result = validateUSRoutingNumber('02100002A')
    expect(result.valid).toBe(false)
  })

  it('fails empty string', () => {
    const result = validateUSRoutingNumber('')
    expect(result.valid).toBe(false)
  })
})
