declare const __brand: unique symbol;
type Brand<T, B> = T & {
    readonly [__brand]: B;
};
type IBAN = Brand<string, 'IBAN'>;
type SortCode = Brand<string, 'SortCode'>;
type AccountNumber = Brand<string, 'AccountNumber'>;
type CurrencyCode = Brand<string, 'CurrencyCode'>;
type BIC = Brand<string, 'BIC'>;
type CardNumber = Brand<string, 'CardNumber'>;
type SupportedCurrency = 'GBP' | 'EUR' | 'USD' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'NZD';
type ValidationSuccess<T> = {
    valid: true;
    value: T;
    formatted: string;
};
type ValidationFailure = {
    valid: false;
    error: string;
};
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;
type MoneyResult = {
    valid: true;
    amount: number;
    currency: SupportedCurrency;
    formatted: string;
} | {
    valid: false;
    error: string;
};

export type { AccountNumber as A, BIC as B, CurrencyCode as C, IBAN as I, MoneyResult as M, SortCode as S, ValidationResult as V, SupportedCurrency as a, CardNumber as b, ValidationFailure as c, ValidationSuccess as d };
