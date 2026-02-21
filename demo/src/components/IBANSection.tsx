import { useState, useCallback } from 'react'
import { useIBANInput } from 'finprim/react'
import { FieldGroup } from './FieldGroup.tsx'

export function IBANSection() {
  const { formatted, valid, error, onChange: hookChange } = useIBANInput()
  const [display, setDisplay] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip spaces, uppercase, cap at 34 chars (max IBAN length), re-space every 4
    const raw = e.target.value.replace(/\s/g, '').toUpperCase().slice(0, 34)
    const spaced = raw.match(/.{1,4}/g)?.join(' ') ?? raw
    setDisplay(spaced)
    hookChange({ ...e, target: { ...e.target, value: spaced } })
  }, [hookChange])

  return (
    <article className="section-card">
      <div className="section-card__header">
        <div className="section-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="section-card__title">International Transfer</p>
          <p className="section-card__subtitle">Enter the recipient IBAN to validate and format</p>
        </div>
      </div>
      <div className="section-card__body">
        <FieldGroup
          label="IBAN"
          hint="e.g. GB29 NWBK 6016 1331 9268 19"
          valid={valid}
          error={error}
          formatted={formatted || undefined}
        >
          <input
            className="field-group__input"
            type="text"
            value={display}
            onChange={handleChange}
            placeholder="GB29 NWBK 6016 1331 9268 19"
            autoComplete="off"
            spellCheck={false}
            maxLength={42}
            aria-label="IBAN"
          />
        </FieldGroup>
      </div>
    </article>
  )
}
