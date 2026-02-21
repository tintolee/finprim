import { useState, useCallback } from 'react'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode_and_account_number'
import { formatCurrency } from '../currency'
import { validateBIC } from '../bic'
import type {
  SupportedCurrency,
  ValidationResult,
  IBAN,
  SortCode,
  AccountNumber,
  BIC,
} from '../types'

type HookResult<T> = {
  value: string
  formatted: string
  valid: boolean | null
  error: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  result: ValidationResult<T> | null
}

function useValidatedInput<T>(
  validator: (val: string) => ValidationResult<T>,
  minLength = 1
): HookResult<T> {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ValidationResult<T> | null>(null)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      setValue(input)
      if (input.length >= minLength) {
        setResult(validator(input))
      } else {
        setResult(null)
      }
    },
    [validator, minLength]
  )

  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result === null ? null : result.valid,
    error: result && !result.valid ? result.error : null,
    onChange,
    result,
  }
}


export function useIBANInput(): HookResult<IBAN> {
  return useValidatedInput(validateIBAN, 5)
}


export function useSortCodeInput(): HookResult<SortCode> {
  return useValidatedInput(validateUKSortCode, 6)
}


export function useAccountNumberInput(): HookResult<AccountNumber> {
  return useValidatedInput(validateUKAccountNumber, 8)
}


export function useBICInput(): HookResult<BIC> {
  return useValidatedInput(validateBIC, 8)
}


export function useCurrencyInput(currency: SupportedCurrency, locale?: string) {
  const [rawValue, setRawValue] = useState<number | null>(null)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
      setRawValue(isNaN(num) ? null : num)
    },
    []
  )

  const formatted = rawValue !== null ? formatCurrency(rawValue, currency, locale) : ''

  return { rawValue, formatted, onChange }
}
