import { I as IBANValidationResult, V as ValidationResult, A as AccountNumber, S as SortCode, a as SupportedCurrency, M as MoneyResult, C as CurrencyCode, B as BIC, b as VATValidationResult, R as RoutingNumber } from './card-D2-7wbam.mjs';
export { c as CardNetwork, d as CardNumber, e as CardValidationResult, f as IBAN, g as IBANValidationSuccess, h as VATNumber, i as VATValidationSuccess, j as ValidationFailure, k as ValidationSuccess, l as isValidationFailure, m as isValidationSuccess, v as validateCardNumber } from './card-D2-7wbam.mjs';

declare function formatIBAN(input: string): string;
declare function validateIBAN(input: string): IBANValidationResult;

declare function formatSortCode(input: string): string;
declare function formatUKAccountNumber(input: string): string;
declare function validateUKSortCode(input: string): ValidationResult<SortCode>;
declare function validateUKAccountNumber(input: string): ValidationResult<AccountNumber>;

declare const SUPPORTED_CURRENCIES: SupportedCurrency[];
declare function validateCurrencyCode(input: string): ValidationResult<CurrencyCode>;
declare function formatCurrency(amount: number, currency: SupportedCurrency, locale?: string): string;
declare function parseMoney(input: string): MoneyResult;

declare function validateBIC(input: string): ValidationResult<BIC>;

declare function validateEUVAT(input: string): VATValidationResult;

declare function validateUSRoutingNumber(input: string): ValidationResult<RoutingNumber>;

type LoanScheduleEntry = {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
};
declare function calculateEMI(principal: number, annualRatePercent: number, months: number): number;
declare function getLoanSchedule(principal: number, annualRatePercent: number, months: number): LoanScheduleEntry[];

export { AccountNumber, BIC, CurrencyCode, IBANValidationResult, type LoanScheduleEntry, MoneyResult, RoutingNumber, SUPPORTED_CURRENCIES, SortCode, SupportedCurrency, VATValidationResult, ValidationResult, calculateEMI, formatCurrency, formatIBAN, formatSortCode, formatUKAccountNumber, getLoanSchedule, parseMoney, validateBIC, validateCurrencyCode, validateEUVAT, validateIBAN, validateUKAccountNumber, validateUKSortCode, validateUSRoutingNumber };
