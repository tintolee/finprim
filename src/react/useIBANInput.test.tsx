import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useIBANInput } from './index'

describe('useIBANInput', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useIBANInput())

    expect(result.current.value).toBe('')
    expect(result.current.valid).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('validates IBAN on change when length > 4', async () => {
    const { result } = renderHook(() => useIBANInput())

    await act(async () => {
      result.current.onChange({
        target: { value: 'GB29NWBK60161331926819' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(true)
    expect(result.current.formatted).toBe('GB29 NWBK 6016 1331 9268 19')
  })

  it('does not validate if input length <= 4', async () => {
    const { result } = renderHook(() => useIBANInput())

    await act(async () => {
      result.current.onChange({
        target: { value: 'GB29' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(null)
  })
})