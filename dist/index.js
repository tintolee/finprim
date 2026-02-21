'use strict';

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
var SUPPORTED_CURRENCIES = [
  "GBP",
  "EUR",
  "USD",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "NZD"
];
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
var SYMBOL_MAP = {
  "\xA3": "GBP",
  "\u20AC": "EUR",
  "$": "USD",
  "\xA5": "JPY",
  "CHF": "CHF"
};
function validateCurrencyCode(input) {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }
  const upper = input.toUpperCase();
  if (!SUPPORTED_CURRENCIES.includes(upper)) {
    return {
      valid: false,
      error: `Unsupported currency code: ${input}. Supported: ${SUPPORTED_CURRENCIES.join(", ")}`
    };
  }
  return {
    valid: true,
    value: upper,
    formatted: upper
  };
}
function formatCurrency(amount, currency, locale) {
  const resolvedLocale = locale ?? CURRENCY_LOCALES[currency] ?? "en-GB";
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 0 : 2
  }).format(amount);
}
function parseMoney(input) {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }
  let currency;
  let cleaned = input.trim();
  for (const [symbol, code] of Object.entries(SYMBOL_MAP)) {
    if (cleaned.startsWith(symbol) || cleaned.endsWith(symbol)) {
      currency = code;
      cleaned = cleaned.replace(symbol, "").trim();
      break;
    }
  }
  if (!currency) {
    return { valid: false, error: "Could not detect currency from input. Expected a symbol like \xA3, \u20AC, $, \xA5" };
  }
  const normalised = cleaned.replace(/,/g, "");
  const amount = parseFloat(normalised);
  if (isNaN(amount)) {
    return { valid: false, error: `Could not parse amount from: "${cleaned}"` };
  }
  return {
    valid: true,
    amount,
    currency,
    formatted: formatCurrency(amount, currency)
  };
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
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }
  const digits = input.replace(/[\s-]/g, "");
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
    let digit = parseInt(digits[i], 10);
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

exports.SUPPORTED_CURRENCIES = SUPPORTED_CURRENCIES;
exports.formatCurrency = formatCurrency;
exports.parseMoney = parseMoney;
exports.validateBIC = validateBIC;
exports.validateCardNumber = validateCardNumber;
exports.validateCurrencyCode = validateCurrencyCode;
exports.validateIBAN = validateIBAN;
exports.validateUKAccountNumber = validateUKAccountNumber;
exports.validateUKSortCode = validateUKSortCode;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map