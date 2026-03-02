import type { RoutingNumber, ValidationResult } from './types'
import { guardStringInput } from './_guard'

function routingChecksum(digits: string): boolean {
  if (digits.length !== 9) return false
  const sum =
    3 * (Number(digits[0]) + Number(digits[3]) + Number(digits[6])) +
    7 * (Number(digits[1]) + Number(digits[4]) + Number(digits[7])) +
    Number(digits[2]) + Number(digits[5]) + Number(digits[8])
  return sum % 10 === 0
}

export function validateUSRoutingNumber(input: string): ValidationResult<RoutingNumber> {
  const guarded = guardStringInput(input)
  if (!guarded.ok) return { valid: false, error: guarded.error }

  const cleaned = guarded.value.replace(/\s/g, '')

  if (!/^\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'US routing number must be exactly 9 digits',
    }
  }

  if (!routingChecksum(cleaned)) {
    return { valid: false, error: 'US routing number checksum is invalid' }
  }

  return {
    valid: true,
    value: cleaned as RoutingNumber,
    formatted: cleaned,
  }
}
