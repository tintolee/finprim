export { validateIBAN, formatIBAN } from './iban'
export {
  validateUKSortCode,
  validateUKAccountNumber,
  formatSortCode,
  formatUKAccountNumber,
} from './sortcode'
export { validateCurrencyCode, formatCurrency, parseMoney, SUPPORTED_CURRENCIES } from './currency'
export { validateBIC } from './bic'
export { validateCardNumber } from './card'
export { validateEUVAT } from './vat'
export { validateUSRoutingNumber } from './routing'
export { calculateEMI, getLoanSchedule } from './loan'

export type {
  IBAN,
  SortCode,
  AccountNumber,
  CurrencyCode,
  BIC,
  CardNumber,
  VATNumber,
  RoutingNumber,
  SupportedCurrency,
  ValidationResult,
  ValidationSuccess,
  ValidationFailure,
  IBANValidationResult,
  IBANValidationSuccess,
  VATValidationResult,
  VATValidationSuccess,
  MoneyResult,
} from './types'

export { isValidationSuccess, isValidationFailure } from './types'

export type { CardNetwork, CardValidationResult } from './card'
export type { LoanScheduleEntry } from './loan'
