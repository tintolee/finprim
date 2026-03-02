import { describe, it, expect } from 'vitest'
import { formatIBAN } from '../iban'
import { formatSortCode, formatUKAccountNumber } from '../sortcode'

describe('formatIBAN', () => {
  it('formats with spaces every 4 chars', () => {
    expect(formatIBAN('GB29NWBK60161331926819')).toBe('GB29 NWBK 6016 1331 9268 19')
  })

  it('strips existing spaces and uppercases', () => {
    expect(formatIBAN('gb29 nwbk 6016')).toBe('GB29 NWBK 6016')
  })
})

describe('formatSortCode', () => {
  it('formats 6 digits as XX-XX-XX', () => {
    expect(formatSortCode('601613')).toBe('60-16-13')
  })

  it('strips hyphens and spaces from input', () => {
    expect(formatSortCode('60-16-13')).toBe('60-16-13')
    expect(formatSortCode('60 16 13')).toBe('60-16-13')
  })

  it('caps at 6 digits', () => {
    expect(formatSortCode('60161399')).toBe('60-16-13')
  })
})

describe('formatUKAccountNumber', () => {
  it('formats 8 digits as XXXX XXXX', () => {
    expect(formatUKAccountNumber('31926819')).toBe('3192 6819')
  })

  it('strips spaces', () => {
    expect(formatUKAccountNumber('3192 6819')).toBe('3192 6819')
  })
})
