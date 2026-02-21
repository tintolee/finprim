import { useState } from 'react';

// import { InterestDemo } from './components/InterestDemo';
import type { FinprimExample } from './types';
import { IbanValidator } from './components/IbanValidator';
import { UkBankValidator } from './components/UkBankValidator';
import { ExampleCard } from './components/ExampleCard';
import { CurrencyShowcase } from './components/CurrencyShowcase';
import { ZodFormDemo } from './ZodFormDemo';

// THE REGISTRY: Just add new team components here!
const EXAMPLES: FinprimExample[] = [
  // {
  //   id: 'interest',
  //   title: 'Compound Interest',
  //   description: 'Calculates compound interest over time.',
  //   component: InterestDemo,
  // },
  {
    id: 'iban',
    title: 'IBAN Validator',
    description: 'Real-time validation and formatting for international bank account numbers.',
    component: IbanValidator,
  },
  {
    id: 'uk-bank',
    title: 'UK Bank Details',
    description: 'Validate UK Sort Codes and Account Numbers.',
    component: UkBankValidator,
  },
  {
    id: 'currency',
    title: 'Currency Engine',
    description: 'International formatting and intelligent string parsing.',
    component: CurrencyShowcase,
  },
  {
    id: 'zod',
    title: 'Zod Integration',
    description: 'Use finprim schemas to build type-safe, validated forms effortlessly.',
    component: ZodFormDemo,
  },
  // { id: 'tax', title: 'Tax Bracket', description: '...', component: TaxDemo },
];

export default function App() {
  const [activeId, setActiveId] = useState<string>(EXAMPLES[0].id);
  const activeExample = EXAMPLES.find((ex) => ex.id === activeId);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar - Dynamically renders from the registry */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6">
        <h1 className="mb-6 text-2xl font-black text-indigo-600">FinPrim Docs</h1>
        <nav className="flex flex-col gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActiveId(ex.id)}
              className={`rounded-lg px-4 py-2 text-left font-medium transition-colors ${activeId === ex.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {ex.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        <header className="mb-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">{activeExample?.title}</h2>
          <p className="mt-2 text-gray-500">{activeExample?.description}</p>
        </header>

        <ExampleCard>
          {activeExample ? <activeExample.component /> : <p>Select an example</p>}
        </ExampleCard>
      </main>
    </div>
  );
}