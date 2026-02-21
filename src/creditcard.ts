import type { CreditCardNumber, CardIssuer, CreditCardValidationResult } from './types'

const ISSUER_PATTERNS: Array<{ issuer: CardIssuer; pattern: RegExp }> = [
  { issuer: 'AmericanExpress', pattern: /^3[47]/ },
  { issuer: 'Mastercard',      pattern: /^(5[1-5]|2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720))/ },
  { issuer: 'Visa',            pattern: /^4/ },
  { issuer: 'Discover',        pattern: /^(6011|64[4-9]|65)/ },
]

function luhn(digits: string): boolean {
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]!, 10) // ! safe: loop bounds guarantee index validity
    if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9 }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

function normalise(input: string): string {
  return input.replace(/[\s-]/g, '')
}

function formatCard(digits: string, issuer: CardIssuer): string {
  if (issuer === 'AmericanExpress') {
    return `${digits.slice(0, 4)} ${digits.slice(4, 10)} ${digits.slice(10, 15)}` // 4-6-5
  }
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}` // 4-4-4-4
}

/**
 * Validates a credit card number string.
 * Accepts numbers with or without spaces/hyphens.
 *
 * @example
 * validateCreditCard('4111111111111111')
 * // { valid: true, value: '4111111111111111', formatted: '4111 1111 1111 1111', issuer: 'Visa' }
 */
export function validateCreditCard(input: string): CreditCardValidationResult {
  const digits = normalise(input)

  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: 'Card number must contain only digits, spaces, or hyphens' }
  }

  if (digits.length < 13 || digits.length > 19) {
    return { valid: false, error: `Card number length is invalid (got ${digits.length}, expected 13–19)` }
  }

  const issuerEntry = ISSUER_PATTERNS.find(({ pattern }) => pattern.test(digits))
  const issuer: CardIssuer = issuerEntry?.issuer ?? 'Unknown'

  if (issuer === 'Unknown') {
    return { valid: false, error: 'Unrecognised card issuer' }
  }

  if (issuer === 'AmericanExpress' && digits.length !== 15) {
    return { valid: false, error: `American Express cards must be 15 digits (got ${digits.length})` }
  }

  if (issuer !== 'AmericanExpress' && digits.length !== 16) {
    return { valid: false, error: `${issuer} cards must be 16 digits (got ${digits.length})` }
  }

  if (!luhn(digits)) {
    return { valid: false, error: 'Card number failed Luhn check' }
  }

  return {
    valid: true,
    value: digits as CreditCardNumber,
    formatted: formatCard(digits, issuer),
    issuer,
  }
}
