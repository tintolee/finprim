import type { CardNumber, ValidationResult } from './types'

export type CardNetwork = 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Unknown'

export type CardValidationResult =
  | { valid: true; value: CardNumber; formatted: string; network: CardNetwork; last4: string }
  | { valid: false; error: string }

function detectNetwork(digits: string): CardNetwork {
  if (/^4/.test(digits)) return 'Visa'
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'Amex'
  if (/^6(?:011|5)/.test(digits)) return 'Discover'
  return 'Unknown'
}

function formatCardNumber(digits: string, network: CardNetwork): string {
  if (network === 'Amex') {
    return `${digits.slice(0, 4)} ${digits.slice(4, 10)} ${digits.slice(10, 15)}`
  }
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export function validateCardNumber(input: string): CardValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' }
  }

  const digits = input.replace(/[\s-]/g, '')

  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: 'Card number must contain only digits' }
  }

  if (digits.length < 13 || digits.length > 19) {
    return {
      valid: false,
      error: `Card number length invalid. Expected 13-19 digits, got ${digits.length}`,
    }
  }

  let sum = 0
  let shouldDouble = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i]!, 10)
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  if (sum % 10 !== 0) {
    return { valid: false, error: 'Card number failed Luhn check — this is not a valid card number' }
  }

  const network = detectNetwork(digits)

  return {
    valid: true,
    value: digits as CardNumber,
    formatted: formatCardNumber(digits, network),
    network,
    last4: digits.slice(-4),
  }
}
