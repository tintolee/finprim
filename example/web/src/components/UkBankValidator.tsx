import { useState } from 'react';
import { validateUKSortCode, validateUKAccountNumber } from '../../../../src/sortcode';

export const UkBankValidator = () => {
  const [sortCode, setSortCode] = useState('');
  const [account, setAccount] = useState('');

  const scResult = sortCode ? validateUKSortCode(sortCode) : null;
  const accResult = account ? validateUKAccountNumber(account) : null;

  return (
    <div className="flex max-w-md flex-col gap-6">
      {/* Sort Code Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Sort Code</label>
        <input 
          type="text" 
          value={sortCode} 
          onChange={(e) => setSortCode(e.target.value)} 
          placeholder="60-16-13"
          className="rounded-lg border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {scResult && (
          <p className={`text-sm font-medium ${scResult.valid ? 'text-green-600' : 'text-red-600'}`}>
            {scResult.valid ? `✅ Valid: ${'formatted' in scResult ? String(scResult.formatted) : sortCode}` : '❌ Invalid Sort Code'}
          </p>
        )}
      </div>

      {/* Account Number Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Account Number</label>
        <input 
          type="text" 
          value={account} 
          onChange={(e) => setAccount(e.target.value)} 
          placeholder="31926819"
          className="rounded-lg border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {accResult && (
          <p className={`text-sm font-medium ${accResult.valid ? 'text-green-600' : 'text-red-600'}`}>
            {accResult.valid ? '✅ Valid Account Number' : '❌ Invalid Account Number'}
          </p>
        )}
      </div>
    </div>
  );
};