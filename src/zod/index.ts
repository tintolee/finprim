import { z } from 'zod'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode_and_account_number'
import { validateCurrencyCode } from '../currency'
import { validateBIC } from '../bic'
import { validateCardNumber } from '../card'

function refineWith<T>(validator: (val: string) => { valid: boolean; error?: string }) {
  return {
    validate: (val: string) => validator(val).valid,
    message: (val: string) => {
      const result = validator(val)
      return { message: result.valid ? '' : (result as { error: string }).error }
    },
  }
}

export const ibanSchema = z
  .string()
  .refine(refineWith(validateIBAN).validate, refineWith(validateIBAN).message)

export const sortCodeSchema = z
  .string()
  .refine(refineWith(validateUKSortCode).validate, refineWith(validateUKSortCode).message)

export const accountNumberSchema = z
  .string()
  .refine(refineWith(validateUKAccountNumber).validate, refineWith(validateUKAccountNumber).message)

export const currencySchema = z
  .string()
  .refine(refineWith(validateCurrencyCode).validate, refineWith(validateCurrencyCode).message)

export const bicSchema = z
  .string()
  .refine(refineWith(validateBIC).validate, refineWith(validateBIC).message)

export const cardNumberSchema = z
  .string()
  .refine(refineWith(validateCardNumber).validate, refineWith(validateCardNumber).message)

export const ukPaymentSchema = z.object({
  sortCode: sortCodeSchema,
  accountNumber: accountNumberSchema,
  amount: z.number().positive('Amount must be greater than zero'),
  currency: currencySchema,
  reference: z.string().max(18).optional(),
  payeeName: z.string().min(1).max(140).optional(),
})

export const internationalPaymentSchema = z.object({
  iban: ibanSchema,
  bic: bicSchema.optional(),
  amount: z.number().positive('Amount must be greater than zero'),
  currency: currencySchema,
  reference: z.string().max(35).optional(),
  payeeName: z.string().min(1).max(140).optional(),
})

export type UKPayment = z.infer<typeof ukPaymentSchema>
export type InternationalPayment = z.infer<typeof internationalPaymentSchema>
