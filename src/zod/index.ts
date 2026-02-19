import { z } from 'zod'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode'
import { validateCurrencyCode } from '../currency'

/**
 * Zod schema for IBAN validation.
 * Use this directly in your API request schemas.
 *
 * @example
 * const PaymentSchema = z.object({ iban: ibanSchema })
 */
export const ibanSchema = z.string().refine(
  (val) => validateIBAN(val).valid,
  (val) => ({ message: (() => {
    const result = validateIBAN(val)
    return result.valid ? '' : result.error
  })() })
)

/**
 * Zod schema for UK sort code validation.
 * Accepts formats: 60-16-13, 601613, 60 16 13
 */
export const sortCodeSchema = z.string().refine(
  (val) => validateUKSortCode(val).valid,
  (val) => ({ message: (() => {
    const result = validateUKSortCode(val)
    return result.valid ? '' : result.error
  })() })
)

/**
 * Zod schema for UK account number validation.
 */
export const accountNumberSchema = z.string().refine(
  (val) => validateUKAccountNumber(val).valid,
  (val) => ({ message: (() => {
    const result = validateUKAccountNumber(val)
    return result.valid ? '' : result.error
  })() })
)

/**
 * Zod schema for supported currency codes.
 */
export const currencySchema = z.string().refine(
  (val) => validateCurrencyCode(val).valid,
  (val) => ({ message: (() => {
    const result = validateCurrencyCode(val)
    return result.valid ? '' : result.error
  })() })
)

/**
 * Zod schema for a complete UK payment.
 */
export const ukPaymentSchema = z.object({
  sortCode: sortCodeSchema,
  accountNumber: accountNumberSchema,
  amount: z.number().positive('Amount must be greater than zero'),
  currency: currencySchema,
  reference: z.string().max(18).optional(),
})

/**
 * Zod schema for an international payment using IBAN.
 */
export const internationalPaymentSchema = z.object({
  iban: ibanSchema,
  amount: z.number().positive('Amount must be greater than zero'),
  currency: currencySchema,
  reference: z.string().max(35).optional(),
})
