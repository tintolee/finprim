# finprim

**Financial primitives for modern TypeScript applications.**

A unified, production-grade TypeScript library for validating and formatting financial data. No more stitching together five different packages. No more custom glue code. Just clean, typed, fintech-first utilities that work anywhere TypeScript runs.

---

## Why finprim?

Every fintech team builds this internally. Sort code validation here, an IBAN check there, a custom currency formatter somewhere else. It's fragmented, inconsistent, and expensive to maintain.

finprim is the open source version of what your team has already written three times.

---

## Features

- ✅ IBAN validation and formatting (80+ countries)
- ✅ UK sort code validation
- ✅ UK account number validation
- ✅ Currency formatting with full locale support
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
import { validateIBAN, validateUKSortCode, validateUKAccountNumber } from 'finprim'

const iban = validateIBAN('GB29NWBK60161331926819')
// { valid: true, country: 'GB', formatted: 'GB29 NWBK 6016 1331 9268 19' }

const sortCode = validateUKSortCode('60-16-13')
// { valid: true, formatted: '60-16-13', digits: '601613' }

const account = validateUKAccountNumber('31926819')
// { valid: true }
```

### Currency Formatting

```ts
import { formatCurrency, parseMoney } from 'finprim'

formatCurrency(1000.5, 'GBP', 'en-GB')  // '£1,000.50'
formatCurrency(1000.5, 'EUR', 'de-DE')  // '1.000,50 €'
formatCurrency(1000.5, 'USD', 'en-US')  // '$1,000.50'

parseMoney('£1,000.50')  // { amount: 1000.50, currency: 'GBP', valid: true }
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
import { useCurrencyInput, useIBANInput } from 'finprim/react'

function PaymentForm() {
  const { value, formatted, valid, onChange } = useCurrencyInput('GBP', 'en-GB')
  const iban = useIBANInput()

  return (
    <input
      value={formatted}
      onChange={onChange}
      aria-invalid={!valid}
    />
  )
}
```

---

## API Reference

### Validation

| Function | Input | Returns |
|---|---|---|
| `validateIBAN(input)` | `string` | `IBANResult` |
| `validateUKSortCode(input)` | `string` | `SortCodeResult` |
| `validateUKAccountNumber(input)` | `string` | `AccountResult` |
| `validateCurrencyCode(input)` | `string` | `CurrencyResult` |

### Formatting

| Function | Input | Returns |
|---|---|---|
| `formatCurrency(amount, currency, locale)` | `number, string, string` | `string` |
| `formatIBAN(input)` | `string` | `string` |
| `formatSortCode(input)` | `string` | `string` |
| `parseMoney(input)` | `string` | `MoneyResult` |

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

- [ ] SWIFT / BIC validation
- [ ] EU VAT number validation
- [ ] Luhn algorithm for card number validation
- [ ] NestJS pipe integration
- [ ] More locale coverage

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request so we can discuss the change.

```bash
git clone https://github.com/YOUR_USERNAME/finprim
cd finprim
npm install
npm run dev
```

---

## License

MIT
