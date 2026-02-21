import { useState } from 'react';
import { z } from 'zod';
import { ibanSchema, currencySchema } from  '../../../src/zod' ;

// Define the schema using finprim primitives
const paymentSchema = z.object({
  accountName: z.string().min(3, "Name too short"),
  iban: ibanSchema,
  currency: currencySchema,
});


export const ZodFormDemo = () => {
  const [formData, setFormData] = useState({ accountName: '', iban: '', currency: 'GBP' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidate = () => {
    const result = paymentSchema.safeParse(formData);
    if (!result.success) {
      // Format Zod errors into a readable object
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(formattedErrors).map(([k, v]) => [k, v?.[0] || ''])));
    } else {
      setErrors({});
      alert("✅ Schema Validated Successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="finprim-input-group">
        <label className="finprim-label">Account Holder Name</label>
        <input 
          className="finprim-input" 
          onChange={(e) => setFormData({...formData, accountName: e.target.value})}
        />
        {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName}</p>}
      </div>

      <div className="finprim-input-group">
        <label className="finprim-label">IBAN</label>
        <input 
          className="finprim-input" 
          onChange={(e) => setFormData({...formData, iban: e.target.value})}
        />
        {errors.iban && <p className="text-xs text-red-500 mt-1">{errors.iban}</p>}
      </div>

      <button onClick={handleValidate} className="finprim-btn-primary w-full">
        Validate with Zod
      </button>

      <div className="mt-4 p-4 bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-400 mb-2 font-mono">// Schema Definition</p>
        <code className="text-blue-300 text-xs font-mono">
          const schema = z.object({"{ \n"}
          {"  "}iban: ibanSchema,{" \n"}
          {"  "}currency: currencySchema {"\n"}
          {"}"});
        </code>
      </div>
    </div>
  );
};