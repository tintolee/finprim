import { V as ValidationResult, A as AccountNumber, B as BIC, a as SupportedCurrency, I as IBAN, S as SortCode } from '../types-KG-eFvWt.mjs';

type HookResult<T> = {
    value: string;
    formatted: string;
    valid: boolean | null;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    result: ValidationResult<T> | null;
};
/**
 * React hook for IBAN input fields.
 * Validates on change and returns formatted value and error state.
 *
 * @example
 * const { value, formatted, valid, error, onChange } = useIBANInput()
 *
 * return (
 *   <input
 *     value={formatted}
 *     onChange={onChange}
 *     aria-invalid={valid === false}
 *   />
 * )
 */
declare function useIBANInput(): HookResult<IBAN>;
/**
 * React hook for UK sort code input fields.
 *
 * @example
 * const { formatted, valid, error, onChange } = useSortCodeInput()
 */
declare function useSortCodeInput(): HookResult<SortCode>;
/**
 * React hook for UK account number input fields.
 *
 * @example
 * const { formatted, valid, error, onChange } = useAccountNumberInput()
 */
declare function useAccountNumberInput(): HookResult<AccountNumber>;
/**
 * React hook for BIC / SWIFT code input fields.
 *
 * @example
 * const { formatted, valid, error, onChange } = useBICInput()
 */
declare function useBICInput(): HookResult<BIC>;
/**
 * React hook for currency amount inputs with locale-aware formatting.
 * Returns both the raw numeric value and the formatted display string.
 *
 * @example
 * const { rawValue, formatted, onChange } = useCurrencyInput('GBP')
 *
 * return <input value={formatted} onChange={onChange} />
 */
declare function useCurrencyInput(currency: SupportedCurrency, locale?: string): {
    rawValue: number | null;
    formatted: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export { useAccountNumberInput, useBICInput, useCurrencyInput, useIBANInput, useSortCodeInput };
