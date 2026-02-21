import { V as ValidationResult, I as IBAN, A as AccountNumber, S as SortCode, a as SupportedCurrency, M as MoneyResult, C as CurrencyCode, B as BIC, b as CardNumber } from './types-KG-eFvWt.js';
export { c as ValidationFailure, d as ValidationSuccess } from './types-KG-eFvWt.js';

/**
 * Validates an IBAN string.
 * Accepts IBANs with or without spaces.
 * Validates: country code, expected length, characters, and mod97 checksum.
 *
 * @example
 * validateIBAN('GB29NWBK60161331926819')
 * // { valid: true, value: 'GB29NWBK60161331926819', formatted: 'GB29 NWBK 6016 1331 9268 19' }
 *
 * validateIBAN('GB00NWBK60161331926819')
 * // { valid: false, error: 'IBAN checksum is invalid' }
 */
declare function validateIBAN(input: string): ValidationResult<IBAN>;

/**
 * Validates a UK sort code.
 * Accepts formats: 60-16-13, 601613, 60 16 13
 *
 * @example
 * validateUKSortCode('60-16-13')
 * // { valid: true, value: '601613', formatted: '60-16-13' }
 *
 * validateUKSortCode('999')
 * // { valid: false, error: 'Sort code must be 6 digits...' }
 */
declare function validateUKSortCode(input: string): ValidationResult<SortCode>;
/**
 * Validates a UK bank account number.
 * Must be exactly 8 digits.
 *
 * @example
 * validateUKAccountNumber('31926819')
 * // { valid: true, value: '31926819', formatted: '3192 6819' }
 *
 * validateUKAccountNumber('1234')
 * // { valid: false, error: 'UK account number must be exactly 8 digits' }
 */
declare function validateUKAccountNumber(input: string): ValidationResult<AccountNumber>;

declare const SUPPORTED_CURRENCIES: SupportedCurrency[];
/**
 * Validates a currency code against supported ISO 4217 codes.
 *
 * @example
 * validateCurrencyCode('GBP')
 * // { valid: true, value: 'GBP', formatted: 'GBP' }
 *
 * validateCurrencyCode('XYZ')
 * // { valid: false, error: 'Unsupported currency code: XYZ' }
 */
declare function validateCurrencyCode(input: string): ValidationResult<CurrencyCode>;
/**
 * Formats a number as a locale-aware currency string.
 * Uses the built-in Intl.NumberFormat API — zero dependencies.
 *
 * @example
 * formatCurrency(1000.5, 'GBP')          // '£1,000.50'
 * formatCurrency(1000.5, 'EUR', 'de-DE') // '1.000,50 €'
 * formatCurrency(1000.5, 'USD', 'en-US') // '$1,000.50'
 * formatCurrency(1000,   'JPY')          // '¥1,000'
 */
declare function formatCurrency(amount: number, currency: SupportedCurrency, locale?: string): string;
/**
 * Parses a formatted currency string back into a structured money object.
 * Detects the currency from the symbol prefix.
 *
 * @example
 * parseMoney('£1,000.50')
 * // { valid: true, amount: 1000.5, currency: 'GBP', formatted: '£1,000.50' }
 *
 * parseMoney('not money')
 * // { valid: false, error: 'Could not detect currency from input' }
 */
declare function parseMoney(input: string): MoneyResult;

/**
 * Validates a BIC (Bank Identifier Code) / SWIFT code.
 * Accepts both 8-character and 11-character BIC codes.
 *
 * Format: AAAABBCCXXX
 * - AAAA = Bank code (4 letters)
 * - BB   = Country code (2 letters, ISO 3166-1)
 * - CC   = Location code (2 alphanumeric)
 * - XXX  = Branch code (3 alphanumeric, optional — 'XXX' means head office)
 *
 * @example
 * validateBIC('NWBKGB2L')
 * // { valid: true, value: 'NWBKGB2L', formatted: 'NWBKGB2L' }
 *
 * validateBIC('DEUTDEDB')
 * // { valid: true, value: 'DEUTDEDB', formatted: 'DEUTDEDB' }
 */
declare function validateBIC(input: string): ValidationResult<BIC>;

type CardNetwork = 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Unknown';
type CardValidationResult = {
    valid: true;
    value: CardNumber;
    formatted: string;
    network: CardNetwork;
    last4: string;
} | {
    valid: false;
    error: string;
};
/**
 * Validates a card number using the Luhn algorithm.
 * Accepts digits with or without spaces and hyphens.
 *
 * The Luhn algorithm:
 * 1. Double every second digit from the right
 * 2. If doubling produces a number > 9, subtract 9
 * 3. Sum all digits — result must be divisible by 10
 *
 * @example
 * validateCardNumber('4532015112830366')
 * // { valid: true, value: '...', formatted: '4532 0151 1283 0366', network: 'Visa', last4: '0366' }
 *
 * validateCardNumber('1234567890123456')
 * // { valid: false, error: 'Card number failed Luhn check' }
 */
declare function validateCardNumber(input: string): CardValidationResult;

export { AccountNumber, BIC, type CardNetwork, CardNumber, type CardValidationResult, CurrencyCode, IBAN, MoneyResult, SUPPORTED_CURRENCIES, SortCode, SupportedCurrency, ValidationResult, formatCurrency, parseMoney, validateBIC, validateCardNumber, validateCurrencyCode, validateIBAN, validateUKAccountNumber, validateUKSortCode };
