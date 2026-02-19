import type { SortCode, AccountNumber, ValidationResult } from './types'

/**
 * Validates a UK sort code.
 * Accepts formats: 60-16-13, 601613, 60 16 13
 *
 * @example
 * validateUKSortCode('60-16-13')
 * // { valid: true, value: '601613', formatted: '60-16-13' }
 */
export function validateUKSortCode(input: string): ValidationResult<SortCode> {
  const cleaned = input.replace(/[-\s]/g, '')

  if (!/^\d{6}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Sort code must be 6 digits. Accepted formats: 60-16-13, 601613, 60 16 13',
    }
  }

  const formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`

  return {
    valid: true,
    value: cleaned as SortCode,
    formatted,
  }
}

/**
 * Validates a UK bank account number.
 * Must be exactly 8 digits.
 *
 * @example
 * validateUKAccountNumber('31926819')
 * // { valid: true, value: '31926819', formatted: '3192 6819' }
 */
export function validateUKAccountNumber(input: string): ValidationResult<AccountNumber> {
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
