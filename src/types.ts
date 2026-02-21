// Branded types enforce domain correctness at the type level.
// Invalid financial data cannot be passed where valid data is expected.

declare const __brand: unique symbol

type Brand<T, B> = T & { readonly [__brand]: B }

export type IBAN = Brand<string, 'IBAN'>
export type SortCode = Brand<string, 'SortCode'>
export type AccountNumber = Brand<string, 'AccountNumber'>
export type CurrencyCode = Brand<string, 'CurrencyCode'>

// Supported ISO 4217 currency codes
export type SupportedCurrency = 'GBP' | 'EUR' | 'USD' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'NZD'

// Result types returned by all validators
export type ValidationSuccess<T> = {
  valid: true
  value: T
  formatted: string
}

export type ValidationFailure = {
  valid: false
  error: string
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

// Money result from parseMoney
export type MoneyResult =
  | { valid: true; amount: number; currency: SupportedCurrency; formatted: string }
  | { valid: false; error: string }

export type CreditCardNumber = Brand<string, 'CreditCardNumber'>

export type CardIssuer = 'Visa' | 'Mastercard' | 'AmericanExpress' | 'Discover' | 'Unknown'

export type CreditCardValidationSuccess = {
  valid: true
  value: CreditCardNumber
  formatted: string
  issuer: CardIssuer
}

export type CreditCardValidationResult = CreditCardValidationSuccess | ValidationFailure
