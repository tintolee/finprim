import { useState, useCallback } from 'react'
import { useSortCodeInput, useAccountNumberInput } from 'finprim/react'
import { FieldGroup } from './FieldGroup.tsx'

function fakeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return { target: { value } } as React.ChangeEvent<HTMLInputElement>
}

export function UKPaymentSection() {
  const { valid: sortValid, error: sortError, formatted: sortFormatted, onChange: sortHookChange } = useSortCodeInput()
  const { valid: acctValid, error: acctError, formatted: acctFormatted, onChange: acctHookChange } = useAccountNumberInput()

  const [sortDisplay, setSortDisplay] = useState('')
  const [acctDisplay, setAcctDisplay] = useState('')

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
    let display = digits
    if (digits.length > 4) display = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
    else if (digits.length > 2) display = `${digits.slice(0, 2)}-${digits.slice(2)}`
    setSortDisplay(display)
    // Hook validates at raw length === 6, so pass only the digits
    sortHookChange(fakeEvent(digits))
  }, [sortHookChange])

  const handleAcctChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    const display = digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits
    setAcctDisplay(display)
    // Validator strips spaces, so passing the display value is fine
    acctHookChange(fakeEvent(display))
  }, [acctHookChange])

  return (
    <article className="section-card">
      <div className="section-card__header">
        <div className="section-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
            <path d="M2 10h20" stroke="currentColor" strokeWidth="1.75" />
            <path d="M6 14h4M6 17h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="section-card__title">UK Domestic Payment</p>
          <p className="section-card__subtitle">Sort code and account number validation</p>
        </div>
      </div>
      <div className="section-card__body">
        <div className="field-row">
          <FieldGroup
            label="Sort Code"
            hint="e.g. 60-16-13"
            valid={sortValid}
            error={sortError}
            formatted={sortFormatted || undefined}
          >
            <input
              className="field-group__input"
              type="text"
              value={sortDisplay}
              onChange={handleSortChange}
              placeholder="60-16-13"
              autoComplete="off"
              spellCheck={false}
              maxLength={8}
              inputMode="numeric"
              aria-label="Sort code"
            />
          </FieldGroup>
          <FieldGroup
            label="Account Number"
            hint="e.g. 3192 6819"
            valid={acctValid}
            error={acctError}
            formatted={acctFormatted || undefined}
          >
            <input
              className="field-group__input"
              type="text"
              value={acctDisplay}
              onChange={handleAcctChange}
              placeholder="0000 0000"
              autoComplete="off"
              spellCheck={false}
              maxLength={9}
              inputMode="numeric"
              aria-label="Account number"
            />
          </FieldGroup>
        </div>
      </div>
    </article>
  )
}
