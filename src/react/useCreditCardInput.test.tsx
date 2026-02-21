import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCardNumberInput } from './index'

describe('useCardNumberInput', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useCardNumberInput())

    expect(result.current.value).toBe('')
    expect(result.current.valid).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.result).toBe(null)
  })

  it('validates a valid Visa card and returns network', async () => {
    const { result } = renderHook(() => useCardNumberInput())

    await act(async () => {
      result.current.onChange({
        target: { value: '4111111111111111' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(true)
    expect(result.current.result?.valid).toBe(true)
    if (result.current.result?.valid) {
      expect(result.current.result.network).toBe('Visa')
      expect(result.current.result.last4).toBe('1111')
    }
    expect(result.current.formatted).toBe('4111 1111 1111 1111')
    expect(result.current.error).toBe(null)
  })

  it('validates a valid American Express card and returns correct format', async () => {
    const { result } = renderHook(() => useCardNumberInput())

    await act(async () => {
      result.current.onChange({
        target: { value: '378282246310005' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(true)
    if (result.current.result?.valid) {
      expect(result.current.result.network).toBe('Amex')
      expect(result.current.formatted).toBe('3782 822463 10005')
    }
  })

  it('returns error and null result for invalid Luhn', async () => {
    const { result } = renderHook(() => useCardNumberInput())

    await act(async () => {
      result.current.onChange({
        target: { value: '4111111111111112' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(false)
    expect(result.current.error).toContain('Luhn')
    expect(result.current.result?.valid).toBe(false)
  })

  it('does not validate if fewer than 8 cleaned digits', async () => {
    const { result } = renderHook(() => useCardNumberInput())

    await act(async () => {
      result.current.onChange({
        target: { value: '4111111' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(null)
    expect(result.current.result).toBe(null)
  })

  it('accepts input with spaces and formats correctly', async () => {
    const { result } = renderHook(() => useCardNumberInput())

    await act(async () => {
      result.current.onChange({
        target: { value: '4111 1111 1111 1111' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(true)
    expect(result.current.formatted).toBe('4111 1111 1111 1111')
    if (result.current.result?.valid) {
      expect(result.current.result.network).toBe('Visa')
    }
  })
})
