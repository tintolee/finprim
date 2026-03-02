import { useState } from 'react';
import { formatCurrency, parseMoney }from '../../../../src/currency'
import type { SupportedCurrency } from '../../../../src/types';

export const CurrencyShowcase = () => {
  const [amount, setAmount] = useState<number>(1250.50);
  const [currency, setCurrency] = useState<SupportedCurrency>('GBP');
  const [locale, setLocale] = useState('en-GB');
  const [parseInput, setParseInput] = useState('£1,250.50');

  // For the Parsing Demo
  const parsedResult = parseMoney(parseInput);

  return (
    <div className="space-y-10">
      {/* SECTION 1: Formatting */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">1. Format Money</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="finprim-input-group">
            <label className="finprim-label">Amount</label>
            <input 
              type="number" 
              className="finprim-input" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))} 
            />
          </div>
          <div className="finprim-input-group">
            <label className="finprim-label">Currency</label>
            <select className="finprim-input" value={currency} onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div className="finprim-input-group">
            <label className="finprim-label">Locale</label>
            <select className="finprim-input" value={locale} onChange={(e) => setLocale(e.target.value)}>
              <option value="en-GB">English (UK)</option>
              <option value="de-DE">German (Germany)</option>
              <option value="en-US">English (US)</option>
              <option value="fr-FR">French (France)</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-primary-50 p-8 text-center border border-primary-100">
          <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Formatted Output</p>
          <div className="text-5xl font-black text-primary-900">
            {formatCurrency(amount, currency, locale)}
          </div>
        </div>
      </section>

      {/* SECTION 2: Parsing */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">2. Parse Money String</h3>
        <div className="finprim-input-group">
          <label className="finprim-label">Raw String Input</label>
          <input 
            type="text" 
            className="finprim-input" 
            value={parseInput} 
            onChange={(e) => setParseInput(e.target.value)} 
            placeholder="e.g. £1,200.50"
          />
        </div>

        <div className={`p-4 rounded-lg border ${parsedResult.valid ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Valid:</p>
              <p className="font-mono font-bold">{parsedResult.valid ? '✅ Yes' : '❌ No'}</p>
            </div>
            <div>
              <p className="text-gray-500">Extracted Amount:</p>
              <p className="font-mono font-bold text-primary-700">
                {parsedResult.valid ? parsedResult.amount : '---'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};