import type { IBAN, IBANValidationResult } from './types'


const IBAN_LENGTHS: Record<string, number> = {
  AL: 28, AD: 24, AT: 20, AZ: 28, BH: 22, BE: 16, BA: 20, BR: 29,
  BG: 22, CR: 22, HR: 21, CY: 28, CZ: 24, DK: 18, DO: 28, EE: 20,
  FI: 18, FR: 27, GE: 22, DE: 22, GI: 23, GR: 27, GT: 28, HU: 28,
  IS: 26, IE: 22, IL: 23, IT: 27, JO: 30, KZ: 20, KW: 30, LV: 21,
  LB: 28, LI: 21, LT: 20, LU: 20, MK: 19, MT: 31, MR: 27, MU: 30,
  MC: 27, MD: 24, ME: 22, NL: 18, NO: 15, PK: 24, PS: 29, PL: 28,
  PT: 25, QA: 29, RO: 24, SM: 27, SA: 24, RS: 22, SK: 24, SI: 19,
  ES: 24, SE: 24, CH: 21, TN: 24, TR: 26, AE: 23, GB: 22, VG: 24,
}

function mod97(value: string): number {
  let remainder = 0
  for (const char of value) {
    remainder = (remainder * 10 + parseInt(char, 10)) % 97
  }
  return remainder
}


function ibanToDigits(iban: string): string {
  const rearranged = iban.slice(4) + iban.slice(0, 4)
  return rearranged
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0)
 
      return code >= 65 && code <= 90 ? (code - 55).toString() : char
    })
    .join('')
}

function formatIBANString(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim()
}


export function validateIBAN(input: string): ValidationResult<IBAN> {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' }
  }

  const cleaned = input.replace(/\s/g, '').toUpperCase()

  if (cleaned.length < 4) {
    return { valid: false, error: 'IBAN is too short' }
  }

  const countryCode = cleaned.slice(0, 2)

  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return { valid: false, error: 'IBAN must start with a 2-letter country code' }
  }

  const expectedLength = IBAN_LENGTHS[countryCode]

  if (!expectedLength) {
    return { valid: false, error: `Unsupported country code: ${countryCode}` }
  }

  if (cleaned.length !== expectedLength) {
    return {
      valid: false,
      error: `Invalid length for ${countryCode} IBAN. Expected ${expectedLength} characters, got ${cleaned.length}`,
    }
  }

  if (!/^[A-Z0-9]+$/.test(cleaned)) {
    return { valid: false, error: 'IBAN contains invalid characters' }
  }

  const digits = ibanToDigits(cleaned)

  if (mod97(digits) !== 1) {
    return { valid: false, error: 'IBAN checksum is invalid' }
  }

  return {
    valid: true,
    value: cleaned as IBAN,
    formatted: formatIBANString(cleaned),
    countryCode,
  }
}
