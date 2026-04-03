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
function guardNumber(value, options) {
  const label = options.label ?? "Value";
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { ok: false, error: `${label} must be a finite number` };
  }
  if (Number.isNaN(value)) {
    return { ok: false, error: `${label} must not be NaN` };
  }
  if (options.integer && !Number.isInteger(value)) {
    return { ok: false, error: `${label} must be an integer` };
  }
  if (options.min !== void 0 && value < options.min) {
    return { ok: false, error: `${label} must be at least ${options.min}` };
  }
  if (options.max !== void 0 && value > options.max) {
    return { ok: false, error: `${label} must be at most ${options.max}` };
  }
  return { ok: true, value };
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
function formatIBAN(input) {
  if (typeof input !== "string") return "";
  const cleaned = input.replace(/\s/g, "").toUpperCase().slice(0, 34);
  return formatIBANString(cleaned);
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
function formatSortCode(input) {
  if (typeof input !== "string") return "";
  const digits = input.replace(/[-\s]/g, "").slice(0, 6);
  if (digits.length < 6) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
}
function formatUKAccountNumber(input) {
  if (typeof input !== "string") return "";
  const digits = input.replace(/\s/g, "").slice(0, 8);
  if (digits.length < 8) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)}`;
}
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
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const upper = guarded.value.toUpperCase();
  if (!SUPPORTED_CURRENCIES.includes(upper)) {
    return {
      valid: false,
      error: `Unsupported currency code: ${upper}. Supported: ${SUPPORTED_CURRENCIES.join(", ")}`
    };
  }
  return {
    valid: true,
    value: upper,
    formatted: upper
  };
}
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
function parseMoney(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  let currency;
  let cleaned = guarded.value.trim();
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
  const amount = Number.parseFloat(normalised);
  if (Number.isNaN(amount)) {
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

// src/vat.ts
var EU_VAT_PATTERNS = {
  AT: /^ATU\d{8}$/,
  BE: /^BE0?\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,
  GR: /^GR\d{9}$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE\d[A-Z0-9]\d{5}[A-Z]$|^IE\d{7}[A-W][A-I0-9]?$/,
  IT: /^IT\d{11}$/,
  LT: /^LT\d{9}$|^LT\d{12}$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/
};
function validateEUVAT(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const cleaned = guarded.value.replace(/\s/g, "").toUpperCase();
  if (cleaned.length < 4) {
    return { valid: false, error: "VAT number is too short" };
  }
  const countryCode = cleaned.slice(0, 2);
  const pattern = EU_VAT_PATTERNS[countryCode];
  if (!pattern) {
    return { valid: false, error: `Unsupported EU VAT country code: ${countryCode}` };
  }
  if (!pattern.test(cleaned)) {
    return { valid: false, error: `Invalid VAT format for ${countryCode}` };
  }
  const formatted = `${countryCode} ${cleaned.slice(2)}`;
  return {
    valid: true,
    value: cleaned,
    formatted,
    countryCode
  };
}

// src/routing.ts
function routingChecksum(digits) {
  if (digits.length !== 9) return false;
  const sum = 3 * (Number(digits[0]) + Number(digits[3]) + Number(digits[6])) + 7 * (Number(digits[1]) + Number(digits[4]) + Number(digits[7])) + Number(digits[2]) + Number(digits[5]) + Number(digits[8]);
  return sum % 10 === 0;
}
function validateUSRoutingNumber(input) {
  const guarded = guardStringInput(input);
  if (!guarded.ok) return { valid: false, error: guarded.error };
  const cleaned = guarded.value.replace(/\s/g, "");
  if (!/^\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      error: "US routing number must be exactly 9 digits"
    };
  }
  if (!routingChecksum(cleaned)) {
    return { valid: false, error: "US routing number checksum is invalid" };
  }
  return {
    valid: true,
    value: cleaned,
    formatted: cleaned
  };
}

// src/loan.ts
var MAX_LOAN_MONTHS = 3600;
function calculateEMI(principal, annualRatePercent, months) {
  const p = guardNumber(principal, { min: 0, label: "Principal" });
  const m = guardNumber(months, { min: 1, max: MAX_LOAN_MONTHS, integer: true, label: "Months" });
  const rate = guardNumber(annualRatePercent, { min: 0, label: "Annual rate" });
  if (!p.ok || !m.ok || !rate.ok) return 0;
  if (rate.value === 0) return p.value / m.value;
  const r = rate.value / 100 / 12;
  return p.value * (r * (1 + r) ** m.value) / ((1 + r) ** m.value - 1);
}
function getLoanSchedule(principal, annualRatePercent, months) {
  const emi = calculateEMI(principal, annualRatePercent, months);
  if (emi === 0) return [];
  const p = guardNumber(principal, { min: 0, label: "Principal" });
  const m = guardNumber(months, { min: 1, max: MAX_LOAN_MONTHS, integer: true, label: "Months" });
  const rate = guardNumber(annualRatePercent, { min: 0, label: "Annual rate" });
  if (!p.ok || !m.ok || !rate.ok) return [];
  const r = rate.value / 100 / 12;
  const schedule = [];
  let balance = p.value;
  for (let month = 1; month <= m.value; month++) {
    const interest = balance * r;
    const principalPayment = emi - interest;
    balance = Math.max(0, balance - principalPayment);
    schedule.push({
      month,
      payment: emi,
      principal: principalPayment,
      interest,
      balance
    });
  }
  return schedule;
}

// src/types.ts
function isValidationSuccess(result) {
  return result.valid === true;
}
function isValidationFailure(result) {
  return result.valid === false;
}

export { SUPPORTED_CURRENCIES, calculateEMI, formatCurrency, formatIBAN, formatSortCode, formatUKAccountNumber, getLoanSchedule, isValidationFailure, isValidationSuccess, parseMoney, validateBIC, validateCardNumber, validateCurrencyCode, validateEUVAT, validateIBAN, validateUKAccountNumber, validateUKSortCode, validateUSRoutingNumber };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map