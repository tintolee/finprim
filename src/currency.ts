import type { CurrencyCode, SupportedCurrency, MoneyResult, ValidationResult } from './types'

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
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

const SYMBOL_MAP: Record<string, SupportedCurrency> = {
  '£': 'GBP',
  '€': 'EUR',
  '$': 'USD',
  '¥': 'JPY',
  'CHF': 'CHF',
}

export function validateCurrencyCode(input: string): ValidationResult<CurrencyCode> {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' }
  }

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

export function parseMoney(input: string): MoneyResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' }
  }

  let currency: SupportedCurrency | undefined
  let cleaned = input.trim()

  for (const [symbol, code] of Object.entries(SYMBOL_MAP)) {
    if (cleaned.startsWith(symbol) || cleaned.endsWith(symbol)) {
      currency = code
      cleaned = cleaned.replace(symbol, '').trim()
      break
    }
  }

  if (!currency) {
    return { valid: false, error: 'Could not detect currency from input. Expected a symbol like £, €, $, ¥' }
  }

  const normalised = cleaned.replace(/,/g, '')
  const amount = Number.parseFloat(normalised)

  if (Number.isNaN(amount)) {
    return { valid: false, error: `Could not parse amount from: "${cleaned}"` }
  }

  return {
    valid: true,
    amount,
    currency,
    formatted: formatCurrency(amount, currency),
  }
}
