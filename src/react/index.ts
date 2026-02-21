import { useState, useCallback } from 'react'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode_and_account_number'
import { formatCurrency } from '../currency'
import type { SupportedCurrency, ValidationResult, IBAN, SortCode, AccountNumber } from '../types'

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
    if (input.length == 6) {
      setResult(validateUKSortCode(input))
    }
    else if (input.length < 6) {
      setResult(null)
    }
    else {
      setResult({ valid: false, error: 'Sort code must be exactly 6 digits' })
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
