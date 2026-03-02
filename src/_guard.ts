export const MAX_SAFE_INPUT_LENGTH = 256

export function guardStringInput(
  input: unknown,
  label = 'Input'
): { ok: true; value: string } | { ok: false; error: string } {
  if (input == null || typeof input !== 'string') {
    return { ok: false, error: `${label} must be a non-empty string` }
  }
  if (input.length === 0) {
    return { ok: false, error: `${label} must be a non-empty string` }
  }
  if (input.length > MAX_SAFE_INPUT_LENGTH) {
    return {
      ok: false,
      error: `${label} must not exceed ${MAX_SAFE_INPUT_LENGTH} characters`,
    }
  }
  return { ok: true, value: input }
}

export function guardNumber(
  value: unknown,
  options: { min?: number; max?: number; integer?: boolean; label?: string }
): { ok: true; value: number } | { ok: false; error: string } {
  const label = options.label ?? 'Value'
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { ok: false, error: `${label} must be a finite number` }
  }
  if (Number.isNaN(value)) {
    return { ok: false, error: `${label} must not be NaN` }
  }
  if (options.integer && !Number.isInteger(value)) {
    return { ok: false, error: `${label} must be an integer` }
  }
  if (options.min !== undefined && value < options.min) {
    return { ok: false, error: `${label} must be at least ${options.min}` }
  }
  if (options.max !== undefined && value > options.max) {
    return { ok: false, error: `${label} must be at most ${options.max}` }
  }
  return { ok: true, value }
}
