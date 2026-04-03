<p align="center">
  <h1 align="center">finprim</h1>
  <p align="center">Financial primitives for modern TypeScript applications.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/finprim"><img src="https://img.shields.io/npm/v/finprim.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/finprim"><img src="https://img.shields.io/npm/dm/finprim.svg" alt="npm downloads"></a>
  <a href="https://github.com/tintolee/finprim/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/finprim.svg" alt="license"></a>
  <a href="https://github.com/tintolee/finprim"><img src="https://img.shields.io/github/stars/tintolee/finprim?style=social" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="zero dependencies">
  <img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TypeScript strict">
</p>

<p align="center">
  <b>IBAN &middot; BIC/SWIFT &middot; Card &middot; Sort Code &middot; VAT &middot; Routing Number &middot; Loan/EMI &middot; Currency</b><br/>
  One library. Zero dependencies. Fully typed.
</p>

---

> Every fintech team builds this internally. Sort code validation here, an IBAN check there, a custom currency formatter somewhere else. It's fragmented, inconsistent, and expensive to maintain. **finprim is the open source version of what your team has already written three times.**

---

## Quick Start

```bash
npm install finprim
```

```ts
import { validateIBAN, validateCardNumber, formatCurrency } from 'finprim'

const iban = validateIBAN('GB29NWBK60161331926819')
// { valid: true, value: 'GB29NWBK60161331926819', formatted: 'GB29 NWBK 6016 1331 9268 19', countryCode: 'GB' }

const card = validateCardNumber('4532015112830366')
// { valid: true, formatted: '4532 0151 1283 0366', network: 'Visa', last4: '0366' }

formatCurrency(1000.5, 'GBP', 'en-GB')
// '£1,000.50'
```

**That's it.** No config. No setup. Just import and use.

---

## Why finprim?

| Problem | finprim |
|---|---|
| 5 different npm packages for financial validation | **One unified library** |
| Custom glue code between validators | **Consistent API across all validators** |
| Runtime type confusion | **Branded TypeScript types** for compile-time safety |
| No framework integration | **Built-in Zod schemas, React hooks, NestJS pipes** |
| Heavy dependency trees | **Zero runtime dependencies** |

---

## Features

- **Validators** - IBAN (80+ countries), BIC/SWIFT, UK sort code & account number, card number (Luhn + network detection), EU VAT, US ABA routing number
- **Loan math** - EMI calculation and full amortization schedules
- **Formatting** - Display-ready IBAN, sort code, account number, and multi-locale currency formatting
- **Branded types** - Compile-time correctness that prevents invalid data from flowing through your system
- **Framework integrations** - Zod schemas, React hooks, NestJS pipes (all optional)
- **Production-ready** - Input length guards, type checking, no sensitive data logging
- **Lightweight** - Zero dependencies, tree-shakeable ESM + CJS

---

## Integrations

finprim works standalone or plugs into your existing stack:

| Import path | What it contains | Extra dependency |
|---|---|---|
| `finprim` | Core validators, formatters, loan math | none |
| `finprim/zod` | Zod schemas for validation pipelines | `zod` |
| `finprim/react` | React hooks for form inputs | `react` |
| `finprim/nest` | NestJS validation pipes | `@nestjs/common` |

---

## Usage Examples

### Validation

```ts
import {
  validateIBAN,
  validateUKSortCode,
  validateUKAccountNumber,
  validateBIC,
  validateCardNumber,
  validateCurrencyCode,
  validateEUVAT,
  validateUSRoutingNumber,
} from 'finprim'

validateIBAN('GB29NWBK60161331926819')
// { valid: true, value: 'GB29NWBK60161331926819', formatted: 'GB29 NWBK 6016 1331 9268 19', countryCode: 'GB' }

validateUKSortCode('60-16-13')
// { valid: true, value: '601613', formatted: '60-16-13' }

validateUKAccountNumber('31926819')
// { valid: true, value: '31926819', formatted: '3192 6819' }

validateCardNumber('4532015112830366')
// { valid: true, formatted: '4532 0151 1283 0366', network: 'Visa', last4: '0366' }

validateEUVAT('DE123456789')
// { valid: true, value: 'DE123456789', formatted: 'DE 123456789', countryCode: 'DE' }

validateUSRoutingNumber('021000021')
// { valid: true, value: '021000021', formatted: '021000021' }
```

### Formatting & Display

```ts
import { formatIBAN, formatSortCode, formatUKAccountNumber, formatCurrency, parseMoney } from 'finprim'

formatIBAN('GB29NWBK60161331926819')        // 'GB29 NWBK 6016 1331 9268 19'
formatSortCode('601613')                     // '60-16-13'
formatUKAccountNumber('31926819')            // '3192 6819'

formatCurrency(1000.5, 'GBP', 'en-GB')      // '£1,000.50'
formatCurrency(1000.5, 'EUR', 'de-DE')       // '1.000,50 €'
formatCurrency(1000.5, 'USD', 'en-US')       // '$1,000.50'

parseMoney('£1,000.50')
// { valid: true, amount: 1000.50, currency: 'GBP', formatted: '£1,000.50' }
```

### Loan / EMI Calculation

```ts
import { calculateEMI, getLoanSchedule } from 'finprim'

calculateEMI(100_000, 10, 12)
// Monthly payment amount

getLoanSchedule(100_000, 10, 12)
// [{ month, payment, principal, interest, balance }, ...]
```

### Branded Types

```ts
import type { IBAN, SortCode, AccountNumber } from 'finprim'

// Invalid data cannot be passed where valid data is expected
function processPayment(iban: IBAN, amount: number) { /* ... */ }

const result = validateIBAN(input)
if (result.valid) {
  processPayment(result.value, 100) // result.value is typed as IBAN
}
```

### Zod Schemas

```ts
import { z } from 'zod'
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

```tsx
import { useIBANInput, useCardNumberInput, useCurrencyInput } from 'finprim/react'

function PaymentForm() {
  const iban = useIBANInput()
  const card = useCardNumberInput()
  const currency = useCurrencyInput('GBP', 'en-GB')

  return (
    <form>
      <input value={iban.value} onChange={iban.onChange} aria-invalid={iban.valid === false} />
      <input value={card.formatted} onChange={card.onChange} aria-invalid={card.valid === false} />
      <input value={currency.formatted} onChange={currency.onChange} />
    </form>
  )
}
```

### NestJS Pipes

```ts
import { IbanValidationPipe, SortCodeValidationPipe, createValidationPipe } from 'finprim/nest'
import { validateIBAN } from 'finprim'

@Get('iban/:iban')
findByIban(@Param('iban', IbanValidationPipe) iban: string) {
  return this.service.findByIban(iban)
}

// Create a custom pipe from any validator
const MyPipe = createValidationPipe(validateIBAN)
```

---

## API Reference

### Validation

| Function | Input | Returns |
|----------|-------|---------|
| `validateIBAN(input)` | `string` | `IBANValidationResult` (includes `countryCode`) |
| `validateUKSortCode(input)` | `string` | `ValidationResult<SortCode>` |
| `validateUKAccountNumber(input)` | `string` | `ValidationResult<AccountNumber>` |
| `validateCurrencyCode(input)` | `string` | `ValidationResult<CurrencyCode>` |
| `validateBIC(input)` | `string` | `ValidationResult<BIC>` |
| `validateCardNumber(input)` | `string` | `CardValidationResult` (includes `network`, `last4`) |
| `validateEUVAT(input)` | `string` | `VATValidationResult` (includes `countryCode`) |
| `validateUSRoutingNumber(input)` | `string` | `ValidationResult<RoutingNumber>` |

### Formatting

| Function | Input | Returns |
|----------|-------|---------|
| `formatIBAN(input)` | `string` | `string` (space-separated) |
| `formatSortCode(input)` | `string` | `string` (XX-XX-XX) |
| `formatUKAccountNumber(input)` | `string` | `string` (XXXX XXXX) |
| `formatCurrency(amount, currency, locale?)` | `number`, `SupportedCurrency`, `string?` | `string` |
| `parseMoney(input)` | `string` | `MoneyResult` |

### Loan

| Function | Input | Returns |
|----------|-------|---------|
| `calculateEMI(principal, rate, months)` | `number`, `number`, `number` | `number` |
| `getLoanSchedule(principal, rate, months)` | `number`, `number`, `number` | `LoanScheduleEntry[]` |

---

## Roadmap

- [x] IBAN validation (80+ countries)
- [x] BIC/SWIFT validation
- [x] Card number validation (Luhn + network detection)
- [x] EU VAT number validation
- [x] US routing number validation
- [x] UK sort code and account number validation
- [x] Loan/EMI calculation
- [x] Format-only helpers
- [x] Currency formatting with locale support
- [x] Branded TypeScript types
- [x] Zod schema integration
- [x] React hooks
- [x] NestJS pipes
- [ ] More locale coverage
- [ ] SEPA credit transfer XML generation
- [ ] ACH file format support

---

## Security

- **Input length** - All string validators reject input longer than 256 characters
- **Type checking** - Validators require non-empty strings; numeric helpers require finite numbers and sane bounds
- **No sensitive logging** - The library does not log or persist input
- **Format helpers** - Cap input length and accept only strings

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
git clone https://github.com/tintolee/finprim.git
cd finprim
npm install
npm test
```

---

## License

MIT
