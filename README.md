# finprim

**Financial primitives for modern TypeScript applications.**

A unified, production-grade TypeScript library for validating and formatting financial data. No more stitching together five different packages. No more custom glue code. Just clean, typed, fintech-first utilities that work anywhere TypeScript runs.

---

## Why finprim?

Every fintech team builds this internally. Sort code validation here, an IBAN check there, a custom currency formatter somewhere else. It's fragmented, inconsistent, and expensive to maintain.

finprim is the open source version of what your team has already written three times.

---

## Features

- ✅ IBAN validation and formatting (80+ countries, with country code)
- ✅ UK sort code and account number validation
- ✅ BIC/SWIFT validation
- ✅ Card number validation (Luhn, network detection, formatting)
- ✅ Currency validation and formatting with locale support
- ✅ Branded types for compile-time correctness
- ✅ Zod schemas out of the box
- ✅ Optional React hooks for form inputs
- ✅ Zero dependencies at the core
- ✅ Tree-shakeable ESM and CJS builds
- ✅ Fully typed

---

## Installation

```bash
npm install finprim
```

For Zod integration:

```bash
npm install finprim zod
```

---

## Usage

### Validation

```ts
import {
  validateIBAN,
  validateUKSortCode,
  validateUKAccountNumber,
  validateBIC,
  validateCardNumber,
  validateCurrencyCode,
} from 'finprim'

const iban = validateIBAN('GB29NWBK60161331926819')
// { valid: true, value: 'GB29NWBK60161331926819', formatted: 'GB29 NWBK 6016 1331 9268 19', countryCode: 'GB' }

const sortCode = validateUKSortCode('60-16-13')
// { valid: true, value: '601613', formatted: '60-16-13' }

const account = validateUKAccountNumber('31926819')
// { valid: true, value: '31926819', formatted: '3192 6819' }

const card = validateCardNumber('4532015112830366')
// { valid: true, value: '...', formatted: '4532 0151 1283 0366', network: 'Visa', last4: '0366' }
```

### Currency Formatting

```ts
import { formatCurrency, parseMoney } from 'finprim'

formatCurrency(1000.5, 'GBP', 'en-GB')  // '£1,000.50'
formatCurrency(1000.5, 'EUR', 'de-DE')  // '1.000,50 €'
formatCurrency(1000.5, 'USD', 'en-US')  // '$1,000.50'

parseMoney('£1,000.50')  // { valid: true, amount: 1000.50, currency: 'GBP', formatted: '£1,000.50' }
```

### Branded Types

```ts
import type { IBAN, SortCode, AccountNumber, CurrencyCode } from 'finprim'

// Invalid data cannot be passed where valid data is expected
function processPayment(iban: IBAN, amount: number) { ... }

// This forces validation before use
const iban = validateIBAN(input)
if (iban.valid) {
  processPayment(iban.value, 100) // iban.value is typed as IBAN
}
```

### Zod Schemas

```ts
import { ibanSchema, sortCodeSchema, accountNumberSchema, currencySchema } from 'finprim/zod'

const PaymentSchema = z.object({
  iban: ibanSchema,
  sortCode: sortCodeSchema,
  accountNumber: accountNumberSchema,
  amount: z.number().positive(),
  currency: currencySchema,
})
```

### React Hooks

```ts
import { useIBANInput, useCardNumberInput, useCurrencyInput } from 'finprim/react'

function PaymentForm() {
  const iban = useIBANInput()
  const card = useCardNumberInput()
  const { rawValue, formatted, onChange } = useCurrencyInput('GBP', 'en-GB')

  return (
    <>
      <input value={iban.value} onChange={iban.onChange} aria-invalid={iban.valid === false} />
      <input value={card.formatted} onChange={card.onChange} aria-invalid={card.valid === false} />
      <input value={formatted} onChange={onChange} />
    </>
  )
}
```

---

## API Reference

### Validation

| Function | Input | Returns |
|----------|-------|---------|
| `validateIBAN(input)` | `string` | `IBANValidationResult` (includes `countryCode` when valid) |
| `validateUKSortCode(input)` | `string` | `ValidationResult<SortCode>` |
| `validateUKAccountNumber(input)` | `string` | `ValidationResult<AccountNumber>` |
| `validateCurrencyCode(input)` | `string` | `ValidationResult<CurrencyCode>` |
| `validateBIC(input)` | `string` | `ValidationResult<BIC>` |
| `validateCardNumber(input)` | `string` | `CardValidationResult` (includes `network`, `last4` when valid) |

### Formatting

| Function | Input | Returns |
|----------|-------|---------|
| `formatCurrency(amount, currency, locale?)` | `number`, `SupportedCurrency`, `string?` | `string` |
| `parseMoney(input)` | `string` | `MoneyResult` |

Validation results include a `formatted` string when valid (e.g. IBAN and card numbers are space-separated).

---

## Packages

| Import path | What it contains | Extra dependency |
|---|---|---|
| `finprim` | Core validators and formatters | none |
| `finprim/zod` | Zod schemas | `zod` |
| `finprim/react` | React hooks | `react` |

---

## Tech Stack

- TypeScript
- tsup (build)
- Vitest (testing)
- React (optional hooks subpath)
- Zod (optional schema subpath)

---

## Roadmap

- [x] SWIFT / BIC validation
- [x] Luhn algorithm for card number validation
- [ ] EU VAT number validation
- [ ] NestJS pipe integration
- [ ] More locale coverage

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request so we can discuss the change.

```bash
git clone https://github.com/YOUR_USERNAME/finprim
cd finprim
npm install
npm test
npm run dev
```

---

## License

MIT
