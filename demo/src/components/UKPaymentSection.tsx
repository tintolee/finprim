import { useSortCodeInput, useAccountNumberInput } from 'finprim/react'
import { FieldGroup } from './FieldGroup.tsx'

export function UKPaymentSection() {
  const sortCode = useSortCodeInput()
  const accountNumber = useAccountNumberInput()

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
            valid={sortCode.valid}
            error={sortCode.error}
            formatted={sortCode.formatted || undefined}
          >
            <input
              className="field-group__input"
              type="text"
              value={sortCode.value}
              onChange={sortCode.onChange}
              placeholder="60-16-13"
              autoComplete="off"
              spellCheck={false}
              maxLength={8}
              aria-label="Sort code"
            />
          </FieldGroup>
          <FieldGroup
            label="Account Number"
            hint="e.g. 31926819"
            valid={accountNumber.valid}
            error={accountNumber.error}
            formatted={accountNumber.formatted || undefined}
          >
            <input
              className="field-group__input"
              type="text"
              value={accountNumber.value}
              onChange={accountNumber.onChange}
              placeholder="31926819"
              autoComplete="off"
              spellCheck={false}
              maxLength={8}
              aria-label="Account number"
            />
          </FieldGroup>
        </div>
      </div>
    </article>
  )
}
