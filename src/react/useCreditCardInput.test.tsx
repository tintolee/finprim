import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCreditCardInput } from './index'

describe('useCreditCardInput', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useCreditCardInput())

    expect(result.current.value).toBe('')
    expect(result.current.valid).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.issuer).toBe(null)
  })

  it('validates a valid Visa card and returns issuer', () => {
    const { result } = renderHook(() => useCreditCardInput())

    act(() => {
      result.current.onChange({
        target: { value: '4111111111111111' },
      } as any)
    })

    expect(result.current.valid).toBe(true)
    expect(result.current.issuer).toBe('Visa')
    expect(result.current.formatted).toBe('4111 1111 1111 1111')
    expect(result.current.error).toBe(null)
  })

  it('validates a valid American Express card and returns correct format', () => {
    const { result } = renderHook(() => useCreditCardInput())

    act(() => {
      result.current.onChange({
        target: { value: '378282246310005' },
      } as any)
    })

    expect(result.current.valid).toBe(true)
    expect(result.current.issuer).toBe('AmericanExpress')
    expect(result.current.formatted).toBe('3782 822463 10005')
  })

  it('returns error and null issuer for invalid Luhn', () => {
    const { result } = renderHook(() => useCreditCardInput())

    act(() => {
      result.current.onChange({
        target: { value: '4111111111111112' },
      } as any)
    })

    expect(result.current.valid).toBe(false)
    expect(result.current.error).toContain('Luhn')
    expect(result.current.issuer).toBe(null)
  })

  it('does not validate if fewer than 8 cleaned digits', () => {
    const { result } = renderHook(() => useCreditCardInput())

    act(() => {
      result.current.onChange({
        target: { value: '4111111' },
      } as any)
    })

    expect(result.current.valid).toBe(null)
    expect(result.current.issuer).toBe(null)
  })

  it('accepts input with spaces and formats correctly', () => {
    const { result } = renderHook(() => useCreditCardInput())

    act(() => {
      result.current.onChange({
        target: { value: '4111 1111 1111 1111' },
      } as any)
    })

    expect(result.current.valid).toBe(true)
    expect(result.current.formatted).toBe('4111 1111 1111 1111')
    expect(result.current.issuer).toBe('Visa')
  })
})
