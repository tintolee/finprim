import { z } from 'zod';

declare const ibanSchema: z.ZodEffects<z.ZodString, string, string>;
declare const sortCodeSchema: z.ZodEffects<z.ZodString, string, string>;
declare const accountNumberSchema: z.ZodEffects<z.ZodString, string, string>;
declare const currencySchema: z.ZodEffects<z.ZodString, string, string>;
declare const bicSchema: z.ZodEffects<z.ZodString, string, string>;
declare const cardNumberSchema: z.ZodEffects<z.ZodString, string, string>;
declare const vatSchema: z.ZodEffects<z.ZodString, string, string>;
declare const routingNumberSchema: z.ZodEffects<z.ZodString, string, string>;
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

export { type InternationalPayment, type UKPayment, accountNumberSchema, bicSchema, cardNumberSchema, currencySchema, ibanSchema, internationalPaymentSchema, routingNumberSchema, sortCodeSchema, ukPaymentSchema, vatSchema };
