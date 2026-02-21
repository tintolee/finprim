import { z } from 'zod';

/**
 * Zod schema for IBAN validation.
 *
 * @example
 * const schema = z.object({ iban: ibanSchema })
 * schema.parse({ iban: 'GB29NWBK60161331926819' }) // passes
 * schema.parse({ iban: 'invalid' }) // throws ZodError
 */
declare const ibanSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Zod schema for UK sort code validation.
 * Accepts: 60-16-13, 601613, 60 16 13
 */
declare const sortCodeSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Zod schema for UK account number validation.
 */
declare const accountNumberSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Zod schema for supported currency codes.
 */
declare const currencySchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Zod schema for BIC / SWIFT code validation.
 */
declare const bicSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Zod schema for card number validation (Luhn check).
 */
declare const cardNumberSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Complete Zod schema for a UK domestic payment.
 * Ready to use in any NestJS controller, tRPC router, or API handler.
 *
 * @example
 * const body = ukPaymentSchema.parse(req.body)
 * // body.sortCode is validated, body.accountNumber is validated, etc.
 */
declare const ukPaymentSchema: z.ZodObject<{
    sortCode: z.ZodEffects<z.ZodString, string, string>;
    accountNumber: z.ZodEffects<z.ZodString, string, string>;
    amount: z.ZodNumber;
    currency: z.ZodEffects<z.ZodString, string, string>;
    reference: z.ZodOptional<z.ZodString>;
    payeeName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sortCode: string;
    accountNumber: string;
    amount: number;
    currency: string;
    reference?: string | undefined;
    payeeName?: string | undefined;
}, {
    sortCode: string;
    accountNumber: string;
    amount: number;
    currency: string;
    reference?: string | undefined;
    payeeName?: string | undefined;
}>;
/**
 * Complete Zod schema for an international IBAN-based payment.
 */
declare const internationalPaymentSchema: z.ZodObject<{
    iban: z.ZodEffects<z.ZodString, string, string>;
    bic: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    amount: z.ZodNumber;
    currency: z.ZodEffects<z.ZodString, string, string>;
    reference: z.ZodOptional<z.ZodString>;
    payeeName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    currency: string;
    iban: string;
    reference?: string | undefined;
    payeeName?: string | undefined;
    bic?: string | undefined;
}, {
    amount: number;
    currency: string;
    iban: string;
    reference?: string | undefined;
    payeeName?: string | undefined;
    bic?: string | undefined;
}>;
type UKPayment = z.infer<typeof ukPaymentSchema>;
type InternationalPayment = z.infer<typeof internationalPaymentSchema>;

export { type InternationalPayment, type UKPayment, accountNumberSchema, bicSchema, cardNumberSchema, currencySchema, ibanSchema, internationalPaymentSchema, sortCodeSchema, ukPaymentSchema };
