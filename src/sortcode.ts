import type { SortCode, AccountNumber, ValidationResult } from './types'
import { guardStringInput } from './_guard'

export function formatSortCode(input: string): string {
  if (typeof input !== 'string') return ''
  const digits = input.replace(/[-\s]/g, '').slice(0, 6)
  if (digits.length < 6) return digits
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`
}

export function formatUKAccountNumber(input: string): string {
  if (typeof input !== 'string') return ''
  const digits = input.replace(/\s/g, '').slice(0, 8)
  if (digits.length < 8) return digits
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)}`
}

export function validateUKSortCode(input: string): ValidationResult<SortCode> {
  const guarded = guardStringInput(input)
  if (!guarded.ok) return { valid: false, error: guarded.error }

  const cleaned = guarded.value.replace(/[-\s]/g, '')

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
  const guarded = guardStringInput(input)
  if (!guarded.ok) return { valid: false, error: guarded.error }

  const cleaned = guarded.value.replace(/\s/g, '')

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
