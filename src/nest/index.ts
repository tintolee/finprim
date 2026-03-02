import type { PipeTransform } from '@nestjs/common'
import { Injectable, BadRequestException } from '@nestjs/common'
import { validateIBAN } from '../iban'
import { validateUKSortCode, validateUKAccountNumber } from '../sortcode'
import { validateBIC } from '../bic'
import { validateCardNumber } from '../card'
import { validateEUVAT } from '../vat'
import { validateUSRoutingNumber } from '../routing'
import { validateCurrencyCode } from '../currency'

type StringValidator = (val: string) => { valid: boolean; value?: string; error?: string }

function createFinprimPipe(validator: StringValidator): new () => PipeTransform<string, string> {
  @Injectable()
  class FinprimValidationPipe implements PipeTransform<string, string> {
    transform(value: unknown): string {
      if (value == null || typeof value !== 'string') {
        throw new BadRequestException('Input must be a non-empty string')
      }
      if (value.length === 0) {
        throw new BadRequestException('Input must be a non-empty string')
      }
      const result = validator(value)
      if (!result.valid) {
        throw new BadRequestException(result.error ?? 'Validation failed')
      }
      return result.value ?? value
    }
  }
  return FinprimValidationPipe
}

export const IbanValidationPipe = createFinprimPipe(validateIBAN)
export const SortCodeValidationPipe = createFinprimPipe(validateUKSortCode)
export const AccountNumberValidationPipe = createFinprimPipe(validateUKAccountNumber)
export const BicValidationPipe = createFinprimPipe(validateBIC)
export const CardNumberValidationPipe = createFinprimPipe(validateCardNumber)
export const VatValidationPipe = createFinprimPipe(validateEUVAT)
export const RoutingNumberValidationPipe = createFinprimPipe(validateUSRoutingNumber)
export const CurrencyCodeValidationPipe = createFinprimPipe(validateCurrencyCode)

export function createValidationPipe(validator: StringValidator): new () => PipeTransform<string, string> {
  return createFinprimPipe(validator)
}
