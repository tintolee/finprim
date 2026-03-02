import { useState } from 'react'
import { useCurrencyInput } from 'finprim/react'
import type { SupportedCurrency } from 'finprim'
import { FieldGroup } from './FieldGroup.tsx'

const CURRENCIES: SupportedCurrency[] = ['GBP', 'EUR', 'USD', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD']

export function CurrencySection() {
  const [currency, setCurrency] = useState<SupportedCurrency>('GBP')
  const [inputVal, setInputVal] = useState('')
  const { rawValue, formatted, onChange } = useCurrencyInput(currency)

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value)
    onChange(e)
  }

  function handleCurrencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCurrency(e.target.value as SupportedCurrency)
    setInputVal('')
  }

  const hasValue = rawValue !== null && inputVal !== ''

  return (
    <article className="section-card">
      <div className="section-card__header">
        <div className="section-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
            <path d="M12 6v12M9 8.5h4.5a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3H15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="section-card__title">Amount &amp; Currency</p>
          <p className="section-card__subtitle">Live locale-aware currency formatting</p>
        </div>
      </div>
      <div className="section-card__body">
        <div className="currency-row">
          <FieldGroup label="Currency" valid={null} error={null}>
            <select
              className="field-group__select"
              value={currency}
              onChange={handleCurrencyChange}
              aria-label="Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup
            label="Amount"
            hint="Enter a numeric value"
            valid={null}
            error={null}
          >
            <input
              className="field-group__input"
              type="number"
              value={inputVal}
              onChange={handleAmountChange}
              placeholder="1234.56"
              min="0"
              step="0.01"
              inputMode="decimal"
              aria-label="Amount"
            />
          </FieldGroup>
        </div>
        {hasValue && (
          <div className="currency-formatted">
            <span className="currency-formatted__label">Formatted</span>
            <span className="currency-formatted__value">{formatted}</span>
          </div>
        )}
      </div>
    </article>
  )
}
