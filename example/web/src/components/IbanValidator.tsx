import { useState } from 'react';
import {validateIBAN} from '../../../../src/iban'

export const IbanValidator = () => {
  const [input, setInput] = useState('');
  
  // Validates on the fly as the user types
  const result = input ? validateIBAN(input) : null;

  return (
    <div className="flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Enter IBAN</label>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="GB29 NWBK..."
          className={`rounded-lg border p-2.5 focus:outline-none focus:ring-1 ${
            result?.valid 
              ? 'border-green-500 focus:ring-green-500' 
              : result && !result.valid 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
      </div>

      {result && (
        <div className={`mt-2 rounded-xl border p-4 ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h4 className={`font-bold ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
            {result.valid ? '✅ Valid IBAN' : '❌ Invalid IBAN'}
          </h4>
          {result.valid && (
             <div className="mt-2 text-sm text-green-700">
               <p><strong>Country:</strong> {result.formatted}</p>
               <p><strong>Formatted:</strong> {result.formatted}</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};