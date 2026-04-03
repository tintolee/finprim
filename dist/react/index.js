'use strict';

var react = require('react');

// src/react/index.ts

// src/_guard.ts
var MAX_SAFE_INPUT_LENGTH = 256;
function guardStringInput(input, label = "Input") {
  if (input == null || typeof input !== "string") {
    return { ok: false, error: `${label} must be a non-empty string` };
  }
  if (input.length === 0) {
    return { ok: false, error: `${label} must be a non-empty string` };
  }
  if (input.length > MAX_SAFE_INPUT_LENGTH) {
    return {
      ok: false,
      error: `${label} must not exceed ${MAX_SAFE_INPUT_LENGTH} characters`
    };
  }
  return { ok: true, value: input };
}

// src/iban.ts
var IBAN_LENGTHS = {
  AL: 28,
  AD: 24,
  AT: 20,
  AZ: 28,
  BH: 22,
  BE: 16,
  BA: 20,
  BR: 29,
  BG: 22,
  CR: 22,
  HR: 21,
  CY: 28,
  CZ: 24,
  DK: 18,
  DO: 28,
  EE: 20,
  FI: 18,
  FR: 27,
  GE: 22,
  DE: 22,
  GI: 23,
  GR: 27,
  GT: 28,
  HU: 28,
  IS: 26,
  IE: 22,
  IL: 23,
  IT: 27,
  JO: 30,
  KZ: 20,
  KW: 30,
  LV: 21,
  LB: 28,
  LI: 21,
  LT: 20,
  LU: 20,
  MK: 19,
  MT: 31,
  MR: 27,
  MU: 30,
  MC: 27,
  MD: 24,
  ME: 22,
  NL: 18,
  NO: 15,
  PK: 24,
  PS: 29,
  PL: 28,
  PT: 25,
  QA: 29,
  RO: 24,
  SM: 27,
  SA: 24,
  RS: 22,
  SK: 24,
  SI: 19,
  ES: 24,
  SE: 24,
  CH: 21,
  TN: 24,
  TR: 26,
  AE: 23,
  GB: 22,
  VG: 24
};
var LETTER_A = "A".codePointAt(0);
var LETTER_Z = "Z".codePointAt(0);
var LETTER_TO_DIGIT_OFFSET = 55;
function mod97(value) {
  return [...value].reduce(
    (remainder, char) => (remainder * 10 + Number.parseInt(char, 10)) % 97,
    0
  );
}
function ibanToDigits(iban) {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  return [...rearranged].map((char) => {
    const code = char.codePointAt(0) ?? 0;
    return code >= LETTER_A && code <= LETTER_Z ? (code - LETTER_TO_DIGIT_OFFSET).toString() : char;
  }).join("");
}
function formatIBANString(iban) {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}
function validateIBAN(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const cleaned = guarded.value.replace(/\s/g, "").toUpperCase();
  if (cleaned.length < 4) {
    return { valid: false, error: "IBAN is too short" };
  }
  const countryCode = cleaned.slice(0, 2);
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return { valid: false, error: "IBAN must start with a 2-letter country code" };
  }
  const expectedLength = IBAN_LENGTHS[countryCode];
  if (!expectedLength) {
    return { valid: false, error: `Unsupported country code: ${countryCode}` };
  }
  if (cleaned.length !== expectedLength) {
    return {
      valid: false,
      error: `Invalid length for ${countryCode} IBAN. Expected ${expectedLength} characters, got ${cleaned.length}`
    };
  }
  if (!/^[A-Z0-9]+$/.test(cleaned)) {
    return { valid: false, error: "IBAN contains invalid characters" };
  }
  const digits = ibanToDigits(cleaned);
  if (mod97(digits) !== 1) {
    return { valid: false, error: "IBAN checksum is invalid" };
  }
  return {
    valid: true,
    value: cleaned,
    formatted: formatIBANString(cleaned),
    countryCode
  };
}

// src/sortcode.ts
function validateUKSortCode(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const cleaned = guarded.value.replace(/[-\s]/g, "");
  if (!/^\d{6}$/.test(cleaned)) {
    return {
      valid: false,
      error: "Sort code must be exactly 6 digits. Accepted formats: 60-16-13, 601613, 60 16 13"
    };
  }
  const formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`;
  return {
    valid: true,
    value: cleaned,
    formatted
  };
}
function validateUKAccountNumber(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const cleaned = guarded.value.replace(/\s/g, "");
  if (!/^\d{8}$/.test(cleaned)) {
    return {
      valid: false,
      error: "UK account number must be exactly 8 digits"
    };
  }
  const formatted = `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)}`;
  return {
    valid: true,
    value: cleaned,
    formatted
  };
}

// src/currency.ts
var CURRENCY_LOCALES = {
  GBP: "en-GB",
  EUR: "de-DE",
  USD: "en-US",
  JPY: "ja-JP",
  CHF: "de-CH",
  CAD: "en-CA",
  AUD: "en-AU",
  NZD: "en-NZ"
};
function formatCurrency(amount, currency, locale) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "";
  }
  const resolvedLocale = locale ?? CURRENCY_LOCALES[currency] ?? "en-GB";
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 0 : 2
  }).format(amount);
}

// src/bic.ts
var BIC_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
function validateBIC(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const cleaned = guarded.value.replace(/\s/g, "").toUpperCase();
  if (cleaned.length !== 8 && cleaned.length !== 11) {
    return {
      valid: false,
      error: `BIC must be 8 or 11 characters. Got ${cleaned.length}`
    };
  }
  if (!BIC_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: "Invalid BIC format. Expected: 4 letters + 2 letters + 2 alphanumeric + optional 3 alphanumeric"
    };
  }
  const bankCode = cleaned.slice(0, 4);
  const countryCode = cleaned.slice(4, 6);
  const location = cleaned.slice(6, 8);
  const branch = cleaned.length === 11 ? cleaned.slice(8, 11) : "XXX";
  return {
    valid: true,
    value: cleaned,
    formatted: `${bankCode} ${countryCode} ${location} ${branch}`
  };
}

// src/card.ts
function detectNetwork(digits) {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Unknown";
}
function formatCardNumber(digits, network) {
  if (network === "Amex") {
    return `${digits.slice(0, 4)} ${digits.slice(4, 10)} ${digits.slice(10, 15)}`;
  }
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
function validateCardNumber(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const digits = guarded.value.replace(/[\s-]/g, "");
  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: "Card number must contain only digits" };
  }
  if (digits.length < 13 || digits.length > 19) {
    return {
      valid: false,
      error: `Card number length invalid. Expected 13-19 digits, got ${digits.length}`
    };
  }
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  if (sum % 10 !== 0) {
    return { valid: false, error: "Card number failed Luhn check \u2014 this is not a valid card number" };
  }
  const network = detectNetwork(digits);
  return {
    valid: true,
    value: digits,
    formatted: formatCardNumber(digits, network),
    network,
    last4: digits.slice(-4)
  };
}

// src/react/index.ts
function useValidatedInput(validator, minLength = 1) {
  const [value, setValue] = react.useState("");
  const [result, setResult] = react.useState(null);
  const onChange = react.useCallback(
    (e) => {
      const input = e.target.value;
      setValue(input);
      if (input.length >= minLength) {
        setResult(validator(input));
      } else {
        setResult(null);
      }
    },
    [validator, minLength]
  );
  const error = result?.valid === false ? result.error : null;
  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result === null ? null : result.valid,
    error,
    onChange,
    result
  };
}
function useIBANInput() {
  return useValidatedInput(validateIBAN, 5);
}
function useSortCodeInput() {
  return useValidatedInput(validateUKSortCode, 6);
}
function useAccountNumberInput() {
  return useValidatedInput(validateUKAccountNumber, 8);
}
function useBICInput() {
  return useValidatedInput(validateBIC, 8);
}
function useCardNumberInput() {
  return useValidatedInput(validateCardNumber, 8);
}
function useCurrencyInput(currency, locale) {
  const [rawValue, setRawValue] = react.useState(null);
  const onChange = react.useCallback(
    (e) => {
      const digits = e.target.value.replace(/[^0-9.]/g, "");
      const num = Number.parseFloat(digits);
      setRawValue(Number.isNaN(num) ? null : num);
    },
    []
  );
  const formatted = rawValue !== null ? formatCurrency(rawValue, currency, locale) : "";
  return { rawValue, formatted, onChange };
}

exports.useAccountNumberInput = useAccountNumberInput;
exports.useBICInput = useBICInput;
exports.useCardNumberInput = useCardNumberInput;
exports.useCurrencyInput = useCurrencyInput;
exports.useIBANInput = useIBANInput;
exports.useSortCodeInput = useSortCodeInput;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map