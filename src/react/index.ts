import { useState, useCallback } from 'react'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode'
import { formatCurrency } from '../currency'
import { validateBIC } from '../bic'
import { validateCardNumber } from '../card'
import type { CardValidationResult } from '../card'
import type {
  SupportedCurrency,
  ValidationResult,
  IBAN,
  SortCode,
  AccountNumber,
  BIC,
  CardNumber,
} from '../types'

type HookResult<T, R = ValidationResult<T>> = {
  value: string
  formatted: string
  valid: boolean | null
  error: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  result: R | null
}

function useValidatedInput<T, R extends ValidationResult<T> = ValidationResult<T>>(
  validator: (val: string) => R,
  minLength = 1
): HookResult<T, R> {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<R | null>(null)

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

  const error = result?.valid === false ? result.error : null

  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result === null ? null : result.valid,
    error,
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

export function useCardNumberInput(): HookResult<CardNumber, CardValidationResult> {
  return useValidatedInput(validateCardNumber, 8)
}

export function useCurrencyInput(currency: SupportedCurrency, locale?: string) {
  const [rawValue, setRawValue] = useState<number | null>(null)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/[^0-9.]/g, '')
      const num = Number.parseFloat(digits)
      setRawValue(Number.isNaN(num) ? null : num)
    },
    []
  )

  const formatted = rawValue !== null ? formatCurrency(rawValue, currency, locale) : ''

  return { rawValue, formatted, onChange }
}
