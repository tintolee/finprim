import type { SortCode, AccountNumber, ValidationResult } from './types'


 
export function validateUKSortCode(input: string): ValidationResult<SortCode> {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' }
  }

  const cleaned = input.replace(/[-\s]/g, '')

  if (!/^\d{6}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Sort code must be exactly 6 digits. Accepted formats: 60-16-13, 601613, 60 16 13',
    }
  }

  const formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`

  return {
    valid: true,
    value: cleaned as SortCode,
    formatted,
  }
}


export function validateUKAccountNumber(input: string): ValidationResult<AccountNumber> {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' }
  }

  const cleaned = input.replace(/\s/g, '')

  if (!/^\d{8}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'UK account number must be exactly 8 digits',
    }
  }

  const formatted = `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)}`

  return {
    valid: true,
    value: cleaned as AccountNumber,
    formatted,
  }
}
