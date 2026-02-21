import { z } from 'zod'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode'
import { validateCurrencyCode } from '../currency'
import { validateBIC } from '../bic'
import { validateCardNumber } from '../card'

type StringValidator = (val: string) => { valid: boolean; error?: string }

function refineWith(validator: StringValidator) {
  return {
    validate: (val: string) => validator(val).valid,
    message: (val: string) => {
      const result = validator(val)
      return { message: result.valid ? '' : (result.error ?? 'Invalid') }
    },
  }
}

const ibanRefiner = refineWith(validateIBAN)
const sortCodeRefiner = refineWith(validateUKSortCode)
const accountNumberRefiner = refineWith(validateUKAccountNumber)
const currencyRefiner = refineWith(validateCurrencyCode)
const bicRefiner = refineWith(validateBIC)
const cardNumberRefiner = refineWith(validateCardNumber)

export const ibanSchema = z.string().refine(ibanRefiner.validate, ibanRefiner.message)

export const sortCodeSchema = z.string().refine(sortCodeRefiner.validate, sortCodeRefiner.message)

export const accountNumberSchema = z
  .string()
  .refine(accountNumberRefiner.validate, accountNumberRefiner.message)

export const currencySchema = z.string().refine(currencyRefiner.validate, currencyRefiner.message)

export const bicSchema = z.string().refine(bicRefiner.validate, bicRefiner.message)

export const cardNumberSchema = z.string().refine(cardNumberRefiner.validate, cardNumberRefiner.message)

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
