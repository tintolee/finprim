import type { BIC, ValidationResult } from './types'


const BIC_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/


export function validateBIC(input: string): ValidationResult<BIC> {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' }
  }

  const cleaned = input.replace(/\s/g, '').toUpperCase()

  if (cleaned.length !== 8 && cleaned.length !== 11) {
    return {
      valid: false,
      error: `BIC must be 8 or 11 characters. Got ${cleaned.length}`,
    }
  }

  if (!BIC_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid BIC format. Expected: 4 letters + 2 letters + 2 alphanumeric + optional 3 alphanumeric',
    }
  }

  const bankCode    = cleaned.slice(0, 4)
  const countryCode = cleaned.slice(4, 6)
  const location    = cleaned.slice(6, 8)
  const branch      = cleaned.length === 11 ? cleaned.slice(8, 11) : 'XXX'

  return {
    valid: true,
    value: cleaned as BIC,
    formatted: `${bankCode} ${countryCode} ${location} ${branch}`,
  }
}
