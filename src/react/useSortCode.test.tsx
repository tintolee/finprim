import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSortCodeInput } from './index'

describe('useSortCodeInput', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useSortCodeInput())

    expect(result.current.value).toBe('')
    expect(result.current.valid).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('validates sort code on change when length = 6', async () => {
    const { result } = renderHook(() => useSortCodeInput())

    await act(async () => {
      result.current.onChange({
        target: { value: '601613' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(true)
    expect(result.current.formatted).toBe('60-16-13')
  })

  it('does not validate if input length < 6', async () => {
    const { result } = renderHook(() => useSortCodeInput())

    await act(async () => {
      result.current.onChange({
        target: { value: '6016' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.valid).toBe(null)
  })
})