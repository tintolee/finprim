declare const __brand: unique symbol
type Brand<T, B> = T & { readonly [__brand]: B }

export type IBAN = Brand<string, 'IBAN'>
export type SortCode = Brand<string, 'SortCode'>
export type AccountNumber = Brand<string, 'AccountNumber'>
export type CurrencyCode = Brand<string, 'CurrencyCode'>
export type BIC = Brand<string, 'BIC'>
export type CardNumber = Brand<string, 'CardNumber'>
export type VATNumber = Brand<string, 'VATNumber'>
export type RoutingNumber = Brand<string, 'RoutingNumber'>

export type SupportedCurrency =
  | 'GBP' | 'EUR' | 'USD' | 'JPY'
  | 'CHF' | 'CAD' | 'AUD' | 'NZD'

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

export function isValidationSuccess<T>(
  result: ValidationResult<T>
): result is ValidationSuccess<T> {
  return result.valid === true
}

export function isValidationFailure<T>(
  result: ValidationResult<T>
): result is ValidationFailure {
  return result.valid === false
}

export type IBANValidationSuccess = ValidationSuccess<IBAN> & { countryCode: string }
export type IBANValidationResult = IBANValidationSuccess | ValidationFailure

export type MoneyResult =
  | { valid: true; amount: number; currency: SupportedCurrency; formatted: string }
  | { valid: false; error: string }

export type VATValidationSuccess = ValidationSuccess<VATNumber> & { countryCode: string }
export type VATValidationResult = VATValidationSuccess | ValidationFailure
