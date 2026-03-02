import { useState } from 'react'
import { validateIBAN } from 'finprim'

export function IbanValidator() {
  const [input, setInput] = useState('')

  const result = input ? validateIBAN(input) : null

  return (
    <div className="space-y-6">
      <div className="finprim-input-group">
        <label className="finprim-label" htmlFor="iban-validator-input">
          Enter IBAN
        </label>
        <input
          id="iban-validator-input"
          className="finprim-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="GB29 NWBK..."
          aria-label="IBAN"
        />
      </div>

      {result && (
        <div
          className={`mt-2 rounded-xl border p-4 ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          <h4 className={`font-bold ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
            {result.valid ? 'Valid IBAN' : 'Invalid IBAN'}
          </h4>
          {result.valid && (
            <div className="mt-2 text-sm text-green-700">
              <p><strong>Country:</strong> {result.countryCode}</p>
              <p><strong>Formatted:</strong> {result.formatted}</p>
            </div>
          )}
          {!result.valid && result.error && (
            <p className="mt-2 text-sm text-red-700">{result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}