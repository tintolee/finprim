import { useState } from 'react';
// import { calculateEMI } from 'finprim'; // Uncomment when ready

export const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [months, setMonths] = useState(12);
//   const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    // TODO: Replace with finprim logic
    // const emi = calculateEMI(principal, rate, months);
    // setResult(emi);
    alert("finprim logic goes here!");
  };

  return (
    <div className="flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Principal Amount ($)</label>
        <input 
          type="number" 
          value={principal} 
          onChange={(e) => setPrincipal(Number(e.target.value))} 
          className="rounded-lg border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-700">Rate (%)</label>
          <input 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))} 
            className="rounded-lg border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-700">Months</label>
          <input 
            type="number" 
            value={months} 
            onChange={(e) => setMonths(Number(e.target.value))} 
            className="rounded-lg border border-gray-300 p-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
          />
        </div>
      </div>

      <button 
        onClick={handleCalculate} 
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
      >
        Calculate Payment
      </button>
      
      {/* Result Card */}
      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-6 text-center">
        <p className="text-sm font-medium text-indigo-800">Monthly Payment</p>
        <p className="mt-1 text-4xl font-black text-indigo-900">
          {/* {result !== null ? `$${result.toFixed(2)}` : '$0.00'} */}
        </p>
      </div>
    </div>
  );
};