import type { VATNumber, VATValidationResult } from './types'
import { guardStringInput } from './_guard'

const EU_VAT_PATTERNS: Record<string, RegExp> = {
  AT: /^ATU\d{8}$/,
  BE: /^BE0?\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,
  GR: /^GR\d{9}$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE\d[A-Z0-9]\d{5}[A-Z]$|^IE\d{7}[A-W][A-I0-9]?$/,
  IT: /^IT\d{11}$/,
  LT: /^LT\d{9}$|^LT\d{12}$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/,
}

export function validateEUVAT(input: string): VATValidationResult {
  const guarded = guardStringInput(input)
  if (!guarded.ok) return { valid: false, error: guarded.error }

  const cleaned = guarded.value.replace(/\s/g, '').toUpperCase()

  if (cleaned.length < 4) {
    return { valid: false, error: 'VAT number is too short' }
  }

  const countryCode = cleaned.slice(0, 2)

  const pattern = EU_VAT_PATTERNS[countryCode]
  if (!pattern) {
    return { valid: false, error: `Unsupported EU VAT country code: ${countryCode}` }
  }

  if (!pattern.test(cleaned)) {
    return { valid: false, error: `Invalid VAT format for ${countryCode}` }
  }

  const formatted = `${countryCode} ${cleaned.slice(2)}`

  return {
    valid: true,
    value: cleaned as VATNumber,
    formatted,
    countryCode,
  }
}
