import type { ReactNode } from 'react'

interface FieldGroupProps {
  label: string
  hint?: string
  valid: boolean | null
  error: string | null
  formatted?: string
  badge?: ReactNode
  children: ReactNode
}

export function FieldGroup({
  label,
  hint,
  valid,
  error,
  formatted,
  badge,
  children,
}: FieldGroupProps) {
  const stateClass =
    valid === true ? 'field-group--valid' :
    valid === false ? 'field-group--invalid' :
    ''

  return (
    <div className={`field-group ${stateClass}`}>
      <div className="field-group__label-row">
        <label className="field-group__label">{label}</label>
        {badge}
      </div>
      {hint && <p className="field-group__hint">{hint}</p>}
      {children}
      <div className="field-group__feedback" aria-live="polite">
        {valid === false && error && (
          <span className="field-group__error">{error}</span>
        )}
        {valid === true && formatted && (
          <span className="field-group__formatted">{formatted}</span>
        )}
      </div>
    </div>
  )
}
