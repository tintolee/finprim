import { useState, useCallback } from 'react'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode'
import { formatCurrency } from '../currency'
import { validateCreditCard } from '../creditcard'
import type { SupportedCurrency, ValidationResult, IBAN, SortCode, AccountNumber, CreditCardValidationResult } from '../types'

/**
 * React hook for IBAN input fields.
 * Validates on change and returns formatted value.
 *
 * @example
 * const { value, formatted, valid, error, onChange } = useIBANInput()
 */
export function useIBANInput() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ValidationResult<IBAN> | null>(null)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setValue(input)
    if (input.length > 4) {
      setResult(validateIBAN(input))
    } else {
      setResult(null)
    }
  }, [])

  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result?.valid ?? null,
    error: result && !result.valid ? result.error : null,
    onChange,
  }
}

/**
 * React hook for UK sort code input fields.
 *
 * @example
 * const { value, formatted, valid, error, onChange } = useSortCodeInput()
 */
export function useSortCodeInput() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ValidationResult<SortCode> | null>(null)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setValue(input)
    setResult(validateUKSortCode(input))
  }, [])

  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result?.valid ?? null,
    error: result && !result.valid ? result.error : null,
    onChange,
  }
}

/**
 * React hook for UK account number input fields.
 *
 * @example
 * const { value, formatted, valid, error, onChange } = useAccountNumberInput()
 */
export function useAccountNumberInput() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ValidationResult<AccountNumber> | null>(null)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setValue(input)
    setResult(validateUKAccountNumber(input))
  }, [])

  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result?.valid ?? null,
    error: result && !result.valid ? result.error : null,
    onChange,
  }
}

/**
 * React hook for credit card number input fields.
 * Validates on change after 8 cleaned digits and returns formatted value and issuer.
 *
 * @example
 * const { value, formatted, valid, error, issuer, onChange } = useCreditCardInput()
 */
export function useCreditCardInput() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<CreditCardValidationResult | null>(null)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setValue(input)
    const digits = input.replace(/[\s-]/g, '')
    if (digits.length >= 8) {
      setResult(validateCreditCard(input))
    } else {
      setResult(null)
    }
  }, [])

  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result?.valid ?? null,
    error: result && !result.valid ? result.error : null,
    issuer: result?.valid ? result.issuer : null,
    onChange,
  }
}

/**
 * React hook for currency amount input fields with locale-aware formatting.
 *
 * @example
 * const { rawValue, formatted, onChange } = useCurrencyInput('GBP', 'en-GB')
 */
export function useCurrencyInput(currency: SupportedCurrency, locale?: string) {
  const [rawValue, setRawValue] = useState<number | null>(null)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
    setRawValue(isNaN(num) ? null : num)
  }, [])

  const formatted = rawValue !== null
    ? formatCurrency(rawValue, currency, locale)
    : ''

  return {
    rawValue,
    formatted,
    onChange,
  }
}
