import { useState, useCallback } from 'react';

// src/react/index.ts

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
function mod97(value) {
  let remainder = 0;
  for (const char of value) {
    remainder = (remainder * 10 + parseInt(char, 10)) % 97;
  }
  return remainder;
}
function ibanToDigits(iban) {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  return rearranged.split("").map((char) => {
    const code = char.charCodeAt(0);
    return code >= 65 && code <= 90 ? (code - 55).toString() : char;
  }).join("");
}
function formatIBANString(iban) {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}
function validateIBAN(input) {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }
  const cleaned = input.replace(/\s/g, "").toUpperCase();
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
    formatted: formatIBANString(cleaned)
  };
}

// src/sortcode.ts
function validateUKSortCode(input) {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }
  const cleaned = input.replace(/[-\s]/g, "");
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
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }
  const cleaned = input.replace(/\s/g, "");
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
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }
  const cleaned = input.replace(/\s/g, "").toUpperCase();
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

// src/react/index.ts
function useValidatedInput(validator, minLength = 1) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const onChange = useCallback(
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
  return {
    value,
    formatted: result?.valid ? result.formatted : value,
    valid: result === null ? null : result.valid,
    error: result && !result.valid ? result.error : null,
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
function useCurrencyInput(currency, locale) {
  const [rawValue, setRawValue] = useState(null);
  const onChange = useCallback(
    (e) => {
      const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
      setRawValue(isNaN(num) ? null : num);
    },
    []
  );
  const formatted = rawValue !== null ? formatCurrency(rawValue, currency, locale) : "";
  return { rawValue, formatted, onChange };
}

export { useAccountNumberInput, useBICInput, useCurrencyInput, useIBANInput, useSortCodeInput };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map