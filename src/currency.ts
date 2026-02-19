import type { CurrencyCode, SupportedCurrency, MoneyResult, ValidationResult } from './types'

const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  'GBP', 'EUR', 'USD', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD',
]

const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  GBP: 'en-GB',
  EUR: 'de-DE',
  USD: 'en-US',
  JPY: 'ja-JP',
  CHF: 'de-CH',
  CAD: 'en-CA',
  AUD: 'en-AU',
  NZD: 'en-NZ',
}

/**
 * Validates a currency code against supported ISO 4217 codes.
 *
 * @example
 * validateCurrencyCode('GBP')
 * // { valid: true, value: 'GBP', formatted: 'GBP' }
 */
export function validateCurrencyCode(input: string): ValidationResult<CurrencyCode> {
  const upper = input.toUpperCase() as SupportedCurrency

  if (!SUPPORTED_CURRENCIES.includes(upper)) {
    return {
      valid: false,
      error: `Unsupported currency code: ${input}. Supported: ${SUPPORTED_CURRENCIES.join(', ')}`,
    }
  }

  return {
    valid: true,
    value: upper as CurrencyCode,
    formatted: upper,
  }
}

/**
 * Formats a number as a currency string using locale-aware formatting.
 *
 * @example
 * formatCurrency(1000.5, 'GBP', 'en-GB') // '£1,000.50'
 * formatCurrency(1000.5, 'EUR', 'de-DE') // '1.000,50 €'
 * formatCurrency(1000.5, 'USD', 'en-US') // '$1,000.50'
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  locale?: string
): string {
  const resolvedLocale = locale ?? CURRENCY_LOCALES[currency] ?? 'en-GB'

  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount)
}

/**
 * Parses a formatted currency string back into amount and currency code.
 *
 * @example
 * parseMoney('£1,000.50') // { valid: true, amount: 1000.50, currency: 'GBP', formatted: '£1,000.50' }
 */
export function parseMoney(input: string): MoneyResult {
  const symbolMap: Record<string, SupportedCurrency> = {
    '£': 'GBP',
    '€': 'EUR',
    '$': 'USD',
    '¥': 'JPY',
    'CHF': 'CHF',
    'CA$': 'CAD',
    'A$': 'AUD',
    'NZ$': 'NZD',
  }

  let currency: SupportedCurrency | undefined
  let cleaned = input.trim()

  for (const [symbol, code] of Object.entries(symbolMap)) {
    if (cleaned.startsWith(symbol) || cleaned.endsWith(symbol)) {
      currency = code
      cleaned = cleaned.replace(symbol, '').trim()
      break
    }
  }

  if (!currency) {
    return { valid: false, error: 'Could not detect currency from input' }
  }

  // Remove thousands separators and normalise decimal
  const normalised = cleaned.replace(/[,.\s]/g, (match, offset, str) => {
    const lastSeparator = Math.max(str.lastIndexOf(','), str.lastIndexOf('.'))
    return offset === lastSeparator ? '.' : ''
  })

  const amount = parseFloat(normalised)

  if (isNaN(amount)) {
    return { valid: false, error: 'Could not parse amount from input' }
  }

  return {
    valid: true,
    amount,
    currency,
    formatted: formatCurrency(amount, currency),
  }
}
