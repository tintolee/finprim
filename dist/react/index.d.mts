import { V as ValidationResult, A as AccountNumber, B as BIC, d as CardNumber, e as CardValidationResult, a as SupportedCurrency, f as IBAN, S as SortCode } from '../card-D2-7wbam.mjs';

type HookResult<T, R = ValidationResult<T>> = {
    value: string;
    formatted: string;
    valid: boolean | null;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    result: R | null;
};
declare function useIBANInput(): HookResult<IBAN>;
declare function useSortCodeInput(): HookResult<SortCode>;
declare function useAccountNumberInput(): HookResult<AccountNumber>;
declare function useBICInput(): HookResult<BIC>;
declare function useCardNumberInput(): HookResult<CardNumber, CardValidationResult>;
declare function useCurrencyInput(currency: SupportedCurrency, locale?: string): {
    rawValue: number | null;
    formatted: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export { useAccountNumberInput, useBICInput, useCardNumberInput, useCurrencyInput, useIBANInput, useSortCodeInput };
