import { useState, useCallback } from 'react'
import { useCreditCardInput } from 'finprim/react'
import type { CardIssuer } from 'finprim'
import { FieldGroup } from './FieldGroup.tsx'

function issuerLabel(issuer: CardIssuer): string {
  switch (issuer) {
    case 'AmericanExpress': return 'Amex'
    default: return issuer
  }
}

function issuerBadgeClass(issuer: CardIssuer): string {
  switch (issuer) {
    case 'Visa':            return 'badge badge--visa'
    case 'Mastercard':      return 'badge badge--mastercard'
    case 'AmericanExpress': return 'badge badge--amex'
    case 'Discover':        return 'badge badge--discover'
    default:                return 'badge badge--unknown'
  }
}

function fakeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return { target: { value } } as React.ChangeEvent<HTMLInputElement>
}

export function CreditCardSection() {
  const { valid, error, formatted, issuer, onChange: hookChange } = useCreditCardInput()
  const [display, setDisplay] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits
    setDisplay(formatted)
    // Hook strips spaces before validating, so passing the formatted value is fine
    hookChange(fakeEvent(formatted))
  }, [hookChange])

  const badge = issuer ? (
    <span className={issuerBadgeClass(issuer)}>{issuerLabel(issuer)}</span>
  ) : null

  return (
    <article className="section-card">
      <div className="section-card__header">
        <div className="section-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
            <path d="M2 9h20" stroke="currentColor" strokeWidth="1.75" />
            <circle cx="18" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="15" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div>
          <p className="section-card__title">Card Payment</p>
          <p className="section-card__subtitle">Validate card number with Luhn check</p>
        </div>
      </div>
      <div className="section-card__body">
        <FieldGroup
          label="Card Number"
          hint="Visa, Mastercard, Amex, or Discover"
          valid={valid}
          error={error}
          formatted={formatted || undefined}
          badge={badge}
        >
          <input
            className="field-group__input"
            type="text"
            value={display}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            autoComplete="cc-number"
            spellCheck={false}
            maxLength={19}
            inputMode="numeric"
            aria-label="Card number"
          />
        </FieldGroup>
      </div>
    </article>
  )
}
